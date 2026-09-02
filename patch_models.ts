import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const target = `  app.post("/api/models", async (req, res) => {
    try {
      const { aiConfig } = req.body;
      if (!aiConfig?.apiKey) throw new Error("Missing API Key");`;

const replacement = `  app.post("/api/models", async (req, res) => {
    try {
      let { aiConfig } = req.body;
      if (!aiConfig?.apiKey) {
        if (process.env.GEMINI_API_KEY) {
          aiConfig = { provider: 'gemini', apiKey: process.env.GEMINI_API_KEY };
        } else {
          throw new Error("Missing API Key");
        }
      }`;
      
content = content.replace(target, replacement);

fs.writeFileSync('server.ts', content);
