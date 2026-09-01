import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Server } from "socket.io";
import http from "http";
import fs from "fs";
import cors from "cors";
import os from "os";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { Bonjour } from "bonjour-service";

const DB_FILE = path.join(process.cwd(), "defects.enc");
const CONFIG_FILE = path.join(process.cwd(), "server-config.json");

const CIPHER_ALGO = "aes-256-cbc";

interface ServerConfig {
  orgCode: string;
  inviteCode: string;
  encryptionKey: string;
  users: Array<{ id: string; name: string; email: string; department: string }>;
}

let serverConfig: ServerConfig;

if (fs.existsSync(CONFIG_FILE)) {
  serverConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
} else {
  serverConfig = {
    orgCode: `ORG-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
    inviteCode: crypto.randomBytes(3).toString("hex").toUpperCase(),
    encryptionKey: crypto.randomBytes(32).toString("hex"),
    users: [],
  };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(serverConfig, null, 2));
}

const BACKUP_DIR = path.join(process.cwd(), "backups");
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
    defects = JSON.parse(decData);
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

    const io = new Server(server, { cors: { origin: "*" } });

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
          socket.emit("auth_success", { orgCode: serverConfig.orgCode, users: serverConfig.users, defects });
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
          socket.emit("auth_success", { orgCode: serverConfig.orgCode, users: serverConfig.users, defects });
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
        defects.push(defect);
        saveDefects();
        io.to(serverConfig.orgCode).emit("sync", defects);
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

  // AI Endpoints
  app.post("/api/insights", async (req, res) => {
    try {
      const { defects } = req.body;
      const key = process.env.GEMINI_API_KEY;
      if (!key) return res.status(500).json({ error: "Missing Gemini API Key on Master Server" });
      
      const ai = new GoogleGenAI({ apiKey: key });
      const prompt = `Analyze the following software defects and generate a summary report identifying common root causes, potential risk areas, and overall health of the project. Keep the summary concise, professional, and actionable (max 3 short paragraphs).\n\nDefects Data:\n${JSON.stringify(defects, null, 2)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      res.json({ insights: response.text });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      const { title, description, project } = req.body;
      const key = process.env.GEMINI_API_KEY;
      if (!key) return res.status(500).json({ error: "Missing Gemini API Key on Master Server" });

      const ai = new GoogleGenAI({ apiKey: key });
      const prompt = `Analyze this defect and suggest a concise root cause analysis (1-2 sentences) and resolution notes if applicable.\nTitle: ${title}\nDescription: ${description}\nProject: ${project}\n\nProvide the output in JSON format with "rootCauseAnalysis" and "resolutionNotes" fields.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to analyze defect" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { history, message, systemInstruction } = req.body;
      const key = process.env.GEMINI_API_KEY;
      if (!key) return res.status(500).json({ error: "Missing Gemini API Key on Master Server" });

      const ai = new GoogleGenAI({ apiKey: key });
      
      const contents = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
        }
      });
      
      res.json({ text: response.text });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to generate chat response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
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
