import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const target = `  async function generateAIContent(aiConfig: any, prompt: string, isJson: boolean = false, systemInstruction?: string, history: any[] = []) {
    if (!aiConfig?.apiKey) throw new Error("Missing API Key");`;

const replacement = `  async function generateAIContent(aiConfig: any, prompt: string, isJson: boolean = false, systemInstruction?: string, history: any[] = []) {
    let activeConfig = aiConfig;
    if (!activeConfig?.apiKey) {
      if (process.env.GEMINI_API_KEY) {
        activeConfig = { provider: 'gemini', apiKey: process.env.GEMINI_API_KEY, model: 'gemini-2.5-flash' };
      } else {
        throw new Error("Missing API Key");
      }
    }`;

content = content.replace(target, replacement);

fs.writeFileSync('server.ts', content);
