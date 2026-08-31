import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simple token validation middleware
  const authenticateToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing Google access token' });
    }

    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
      if (!response.ok) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Google token' });
      }
      next();
    } catch (e) {
      res.status(500).json({ error: 'Error validating token' });
    }
  };

  // Define API routes FIRST
  app.post("/api/insights", authenticateToken, async (req, res) => {
    try {
      const { defects } = req.body;
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Analyze the following software defects and generate a summary report identifying common root causes, potential risk areas, and overall health of the project. Keep the summary concise, professional, and actionable (max 3 short paragraphs).
      
Defects Data:
${JSON.stringify(defects, null, 2)}`;

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

  app.post("/api/analyze", authenticateToken, async (req, res) => {
    try {
      const { title, description, project } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Analyze this defect and suggest a concise root cause analysis (1-2 sentences) and resolution notes if applicable. 
Title: ${title}
Description: ${description}
Project: ${project}

Provide the output in JSON format with "rootCauseAnalysis" and "resolutionNotes" fields.`;

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

  app.post("/api/chat", authenticateToken, async (req, res) => {
    try {
      const { history, message, systemInstruction } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
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
      server: { middlewareMode: true },
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
