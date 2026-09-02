import express from "express";
import path from "path";
// Dynamic import used later for vite
import { GoogleGenAI } from "@google/genai";
import { Server } from "socket.io";
import http from "http";
import fs from "fs";
import cors from "cors";
import os from "os";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { Bonjour } from "bonjour-service";

const basePath = process.env.USER_DATA_PATH || path.join(os.homedir(), '.defect-diary');
if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}
const DB_FILE = path.join(basePath, "defects.enc");
const CONFIG_FILE = path.join(basePath, "server-config.json");

const CIPHER_ALGO = "aes-256-cbc";

interface ServerConfig {
  orgCode: string;
  inviteCode: string;
  encryptionKey: string;
  users: Array<{ id: string; name: string; email: string; department: string }>;
  projects?: { id: string; name: string }[];
}

let serverConfig: ServerConfig;

if (fs.existsSync(CONFIG_FILE)) {
  serverConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
  if (!serverConfig.projects) {
    serverConfig.projects = [];
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(serverConfig, null, 2));
  } else {
    let migrated = false;
    serverConfig.projects = serverConfig.projects.map((p: any) => {
      if (typeof p === 'string') {
        migrated = true;
        return { id: require('crypto').randomBytes(4).toString("hex"), name: p };
      }
      return p;
    });
    // Remove duplicates by name
    const seen = new Set();
    serverConfig.projects = serverConfig.projects.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(serverConfig, null, 2));
  }
} else {
  serverConfig = {
    orgCode: `ORG-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
    inviteCode: crypto.randomBytes(3).toString("hex").toUpperCase(),
    encryptionKey: crypto.randomBytes(32).toString("hex"),
    users: [],
    projects: []
  };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(serverConfig, null, 2));
}

const BACKUP_DIR = path.join(basePath, "backups");
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

function createBackup() {
  if (fs.existsSync(DB_FILE)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(BACKUP_DIR, `defects-backup-${timestamp}.enc`);
    try {
      fs.copyFileSync(DB_FILE, backupPath);
      console.log(`Database backed up to ${backupPath}`);
    } catch (e) {
      console.error("Failed to create database backup:", e);
    }
  }
}

// Initial backup on startup
createBackup();

// Periodic backup every 1 hour
setInterval(createBackup, 60 * 60 * 1000);

function encryptData(text: string, keyHex: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(CIPHER_ALGO, Buffer.from(keyHex, "hex"), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decryptData(text: string, keyHex: string) {
  const parts = text.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = Buffer.from(parts[1], "hex");
  const decipher = crypto.createDecipheriv(CIPHER_ALGO, Buffer.from(keyHex, "hex"), iv);
  let decrypted = decipher.update(encryptedText, undefined, "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

let defects: any[] = [];
if (fs.existsSync(DB_FILE)) {
  try {
    const encData = fs.readFileSync(DB_FILE, "utf-8");
    const decData = decryptData(encData, serverConfig.encryptionKey);
    const parsed = JSON.parse(decData);
    
    // Deduplicate IDs
    const seenIds = new Set<string>();
    for (const defect of parsed) {
      if (seenIds.has(defect.id)) {
        defect.id = `${defect.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      seenIds.add(defect.id);
      defects.push(defect);
    }
  } catch (e) {
    console.error("Error decrypting/reading defects DB:", e);
  }
}

function saveDefects() {
  const encData = encryptData(JSON.stringify(defects), serverConfig.encryptionKey);
  fs.writeFileSync(DB_FILE, encData);
}

function saveConfig() {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(serverConfig, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const server = http.createServer(app);
  let io: Server | null = null;

  let isMaster = false;
  let masterUrl: string | null = null;
  const bonjour = new Bonjour();

  console.log("Searching for existing Defect Diary server on LAN...");

  const findServer = () => new Promise<string | null>((resolve) => {
    const browser = bonjour.find({ type: 'defectdiary' });
    let found = false;
    browser.on('up', (service) => {
      if (!found) {
        found = true;
        const ip = service.addresses.find(a => a.includes('.')) || service.addresses[0];
        const url = `http://${ip}:${service.port}`;
        resolve(url);
      }
    });
    setTimeout(() => {
      if (!found) {
        browser.stop();
        resolve(null);
      }
    }, 3000);
  });

  masterUrl = await findServer();

  if (masterUrl) {
    console.log(`Found existing server at ${masterUrl}. Acting as Client.`);
  } else {
    console.log("No server found. Promoting to Master Server.");
    isMaster = true;
    
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          localIp = iface.address;
          break;
        }
      }
    }
    masterUrl = `http://${localIp}:${PORT}`;
    
    try {
      bonjour.publish({ name: 'DefectDiaryServer_' + os.hostname(), type: 'defectdiary', port: PORT });
    } catch (e) {
      console.warn("Could not publish mDNS service (expected in cloud environments)");
    }

    io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      
      socket.on("auth", (profile: { id: string; name: string; email: string; department: string }) => {
        let isWhitelisted = serverConfig.users.some(u => u.id === profile.id);
        
        // Auto-whitelist the first user (usually the master)
        if (!isWhitelisted && serverConfig.users.length === 0) {
          serverConfig.users.push(profile);
          saveConfig();
          isWhitelisted = true;
        }

        if (isWhitelisted) {
          socket.emit("auth_success", { orgCode: serverConfig.orgCode, inviteCode: serverConfig.inviteCode, users: serverConfig.users, defects, projects: serverConfig.projects });
          socket.join(serverConfig.orgCode);
        } else {
          socket.emit("auth_required");
        }
      });

      socket.on("join_org", (data: { inviteCode: string, profile: { id: string; name: string; email: string; department: string } }) => {
        if (data.inviteCode === serverConfig.inviteCode) {
          if (!serverConfig.users.find(u => u.id === data.profile.id)) {
            serverConfig.users.push(data.profile);
            saveConfig();
          }
          socket.emit("auth_success", { orgCode: serverConfig.orgCode, inviteCode: serverConfig.inviteCode, users: serverConfig.users, defects, projects: serverConfig.projects });
          socket.join(serverConfig.orgCode);
          // Broadcast new user list to all in org
          io.to(serverConfig.orgCode).emit("users_updated", serverConfig.users);
        } else {
          socket.emit("auth_failed", "Invalid invite code");
        }
      });

      socket.on("add_defect", (defect) => {
        // Enforce org association
        defect.orgCode = serverConfig.orgCode;
        
        // Prevent duplicate IDs
        if (defects.some(d => d.id === defect.id)) {
          defect.id = `${defect.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
        
        defects.push(defect);
        saveDefects();
        io.to(serverConfig.orgCode).emit("sync", defects);
      });

      socket.on("add_project", (projectName: string) => {
        if (!serverConfig.projects) serverConfig.projects = [];
        if (!serverConfig.projects.find(p => p.name === projectName)) {
          serverConfig.projects.push({ id: require('crypto').randomBytes(4).toString("hex"), name: projectName });
          saveConfig();
          io.to(serverConfig.orgCode).emit("projects_updated", serverConfig.projects);
        }
      });

      socket.on("delete_project", (projectId: string) => {
        if (!serverConfig.projects) return;
        const idx = serverConfig.projects.findIndex(p => p.id === projectId);
        if (idx !== -1) {
          const projectName = serverConfig.projects[idx].name;
          serverConfig.projects.splice(idx, 1);
          saveConfig();
          io.to(serverConfig.orgCode).emit("projects_updated", serverConfig.projects);
          
          // Delete all associated defects
          const originalLen = defects.length;
          defects = defects.filter(d => d.project !== projectName);
          if (defects.length !== originalLen) {
            saveDefects();
            io.to(serverConfig.orgCode).emit("sync", defects);
          }
        }
      });

      socket.on("update_project", ({ id, newName }: { id: string, newName: string }) => {
        if (!serverConfig.projects) serverConfig.projects = [];
        const idx = serverConfig.projects.findIndex(p => p.id === id);
        if (idx !== -1 && newName && !serverConfig.projects.find(p => p.name === newName)) {
          const oldName = serverConfig.projects[idx].name;
          serverConfig.projects[idx].name = newName;
          saveConfig();
          io.to(serverConfig.orgCode).emit("projects_updated", serverConfig.projects);
          
          // Also update all defects with the old project name
          let updated = false;
          defects = defects.map(d => {
            if (d.project === oldName) {
              updated = true;
              return { ...d, project: newName };
            }
            return d;
          });
          if (updated) {
            saveDefects();
            io.to(serverConfig.orgCode).emit("sync", defects);
          }
        }
      });

      socket.on("update_defect", (updated) => {
        defects = defects.map(d => d.id === updated.id ? updated : d);
        saveDefects();
        io.to(serverConfig.orgCode).emit("sync", defects);
      });

      socket.on("delete_defect", (id) => {
        defects = defects.filter(d => d.id !== id);
        saveDefects();
        io.to(serverConfig.orgCode).emit("sync", defects);
      });
    });
  }

  app.get("/api/config", (req, res) => {
    // Only return the org and invite code if they are the master (for their own display)
    res.json({ 
      isMaster, 
      masterUrl,
      orgCode: isMaster ? serverConfig.orgCode : null,
      inviteCode: isMaster ? serverConfig.inviteCode : null 
    });
  });


  app.post("/api/sync", (req, res) => {
    const incomingDefects = req.body.defects || [];
    let changed = false;
    for (const defect of incomingDefects) {
      const existing = defects.find((d: any) => d.id === defect.id);
      if (!existing) {
        defects.push(defect);
        changed = true;
      } else {
        if (new Date(defect.updatedAt || 0) > new Date(existing.updatedAt || 0)) {
          Object.assign(existing, defect);
          changed = true;
        }
      }
    }
    if (changed) {
      saveDefects();
      if (isMaster && io) {
        io.to(serverConfig.orgCode).emit("sync", defects);
      }
    }
    res.json({ defects, projects: serverConfig.projects });
  });

  // Background auto-sync for non-master nodes
  setInterval(async () => {
    if (!isMaster && masterUrl) {
      try {
        const response = await fetch(`${masterUrl}/api/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ defects })
        });
        if (response.ok) {
          const data = await response.json();
          let changed = false;
          for (const defect of data.defects || []) {
            const existing = defects.find((d: any) => d.id === defect.id);
            if (!existing) {
              defects.push(defect);
              changed = true;
            } else if (new Date(defect.updatedAt || 0) > new Date(existing.updatedAt || 0)) {
              Object.assign(existing, defect);
              changed = true;
            }
          }
          if (changed) saveDefects();
          
          if (data.projects) {
             if (JSON.stringify(serverConfig.projects) !== JSON.stringify(data.projects)) {
                serverConfig.projects = data.projects;
                saveConfig();
             }
          }
        }
      } catch (e) {
         // silently fail background sync if master is unreachable
      }
    } else if (isMaster) {
      // Master can also sync with itself just to trigger save if there was some memory updates?
      // Not needed.
    }
  }, 10000); // 10 seconds idle sync
  app.post("/api/promote", (req, res) => {
    isMaster = true;
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          localIp = iface.address;
          break;
        }
      }
    }
    masterUrl = `http://${localIp}:${PORT}`;
    
    try {
      bonjour.publish({ name: 'DefectDiaryServer_' + os.hostname(), type: 'defectdiary', port: PORT });
    } catch (e) {
      console.warn("Could not publish mDNS service (expected in cloud environments)");
    }

    res.json({ success: true });
  });

  // AI Helper function
  async function generateAIContent(aiConfig: any, prompt: string, isJson: boolean = false, systemInstruction?: string, history: any[] = []) {
    let activeConfig = aiConfig;
    if (!activeConfig?.apiKey) {
      throw new Error("Missing API Key");
    }

    if (aiConfig.provider === 'gemini') {
      const ai = new GoogleGenAI({ apiKey: aiConfig.apiKey });
      const contents = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      if (prompt) contents.push({ role: 'user', parts: [{ text: prompt }] });
      const response = await ai.models.generateContent({
        model: aiConfig.model || 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          responseMimeType: isJson ? "application/json" : undefined,
        }
      });
      return response.text;
    }
    
    if (aiConfig.provider === 'openai' || aiConfig.provider === 'custom') {
      const baseUrl = aiConfig.provider === 'custom' ? aiConfig.baseUrl : 'https://api.openai.com/v1';
      
      const messages = [];
      if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
      history.forEach((msg: any) => {
        messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.text });
      });
      if (prompt) messages.push({ role: 'user', content: prompt });

      const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiConfig.apiKey}`
        },
        body: JSON.stringify({
          model: aiConfig.model || 'gpt-4o',
          messages,
          response_format: isJson && aiConfig.provider === 'openai' ? { type: "json_object" } : undefined
        })
      });
      
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      return data.choices[0].message.content;
    }

    if (aiConfig.provider === 'anthropic') {
      const messages = [];
      history.forEach((msg: any) => {
        messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.text });
      });
      if (prompt) messages.push({ role: 'user', content: prompt });

      let systemStr = systemInstruction || "";
      if (isJson) {
        systemStr += "\nProvide the output strictly in JSON format.";
        if (messages.length === 0 || messages[messages.length - 1].role !== 'assistant') {
           messages.push({ role: 'assistant', content: "{" });
        }
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': aiConfig.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: aiConfig.model || 'claude-3-5-sonnet-20240620',
          max_tokens: 1024,
          system: systemStr,
          messages
        })
      });

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      let text = data.content[0].text;
      if (isJson && !text.startsWith('{')) text = "{" + text;
      return text;
    }
    
    throw new Error("Unsupported AI Provider");
  }

  // AI Endpoints
  app.post("/api/models", async (req, res) => {
    try {
      let { aiConfig } = req.body;
      if (!aiConfig?.apiKey) {
        throw new Error("Missing API Key");
      }

      let models: string[] = [];

      if (aiConfig.provider === 'gemini') {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${aiConfig.apiKey}`);
        if (!response.ok) throw new Error("Invalid API Key or Gemini API error");
        const data = await response.json();
        models = data.models
          .filter((m: any) => m.supportedGenerationMethods.includes('generateContent'))
          .map((m: any) => m.name.replace('models/', ''));
      } 
      else if (aiConfig.provider === 'openai' || aiConfig.provider === 'custom') {
        const baseUrl = aiConfig.provider === 'custom' ? aiConfig.baseUrl : 'https://api.openai.com/v1';
        const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/models`, {
          headers: { 'Authorization': `Bearer ${aiConfig.apiKey}` }
        });
        if (!response.ok) throw new Error("Invalid API Key, Base URL, or Provider error");
        const data = await response.json();
        models = data.data.map((m: any) => m.id);
      }
      else if (aiConfig.provider === 'anthropic') {
        const response = await fetch('https://api.anthropic.com/v1/models', {
          headers: { 
            'x-api-key': aiConfig.apiKey, 
            'anthropic-version': '2023-06-01' 
          }
        });
        if (!response.ok) {
           // Fallback test
           const test = await fetch('https://api.anthropic.com/v1/messages', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'x-api-key': aiConfig.apiKey,
               'anthropic-version': '2023-06-01'
             },
             body: JSON.stringify({
               model: 'claude-3-haiku-20240307',
               max_tokens: 1,
               messages: [{role: 'user', content: 'hi'}]
             })
           });
           if (!test.ok) throw new Error("Invalid API Key or Anthropic API error");
           models = ['claude-3-5-sonnet-20241022', 'claude-3-5-sonnet-20240620', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];
        } else {
           const data = await response.json();
           models = data.data.map((m: any) => m.id);
        }
      }
      else {
        throw new Error("Unsupported AI Provider");
      }

      res.json({ models });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to fetch models" });
    }
  });

  app.post("/api/insights", async (req, res) => {
    try {
      const { defects, aiConfig } = req.body;
      const prompt = `Analyze the following software defects and generate a summary report identifying common root causes, potential risk areas, and overall health of the project. Keep the summary concise, professional, and actionable (max 3 short paragraphs).\n\nDefects Data:\n${JSON.stringify(defects, null, 2)}`;

      const text = await generateAIContent(aiConfig, prompt);
      res.json({ insights: text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to generate insights" });
    }
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      const { title, description, project, aiConfig } = req.body;
      const prompt = `Analyze this defect and suggest a concise root cause analysis (1-2 sentences) and resolution notes if applicable.\nTitle: ${title}\nDescription: ${description}\nProject: ${project}\n\nProvide the output in JSON format with "rootCauseAnalysis" and "resolutionNotes" fields.`;

      const text = await generateAIContent(aiConfig, prompt, true);
      
      const result = JSON.parse(text || "{}");
      res.json(result);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to analyze defect" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { history, message, systemInstruction, aiConfig } = req.body;
      const text = await generateAIContent(aiConfig, message, false, systemInstruction, history);
      res.json({ text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to generate chat response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = __dirname;
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
