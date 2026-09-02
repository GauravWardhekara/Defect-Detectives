import fs from 'fs';

// 1. Chatbot.tsx
let content = fs.readFileSync('src/components/Chatbot.tsx', 'utf-8');
content = content.replace(`  const handleSend = async () => {
    if (!input.trim()) return;



    const userMsg: Message = { role: 'user', text: input.trim() };`, `  const handleSend = async () => {
    if (!input.trim()) return;

    if (!aiConfig?.apiKey) {
      setMessages(prev => [...prev, { role: 'user', text: input.trim() }, { role: 'model', text: 'Please configure your AI API key in the Workspace Settings first.' }]);
      setInput('');
      return;
    }

    const userMsg: Message = { role: 'user', text: input.trim() };`);
fs.writeFileSync('src/components/Chatbot.tsx', content);

// 2. DefectFormModal.tsx
let contentForm = fs.readFileSync('src/components/DefectFormModal.tsx', 'utf-8');
contentForm = contentForm.replace(`  const handleAnalyze = async () => {
    setIsAnalyzing(true);`, `  const handleAnalyze = async () => {
    if (!aiConfig?.apiKey) {
      alert("Please configure your AI API key in the Workspace Settings first.");
      return;
    }
    setIsAnalyzing(true);`);
fs.writeFileSync('src/components/DefectFormModal.tsx', contentForm);

// 3. DashboardView.tsx
let contentDash = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');
contentDash = contentDash.replace(`  const generateInsights = async () => {
    setIsGenerating(true);`, `  const generateInsights = async () => {
    if (!aiConfig?.apiKey) {
      setInsights("Please configure your AI API key in the Workspace Settings first.");
      return;
    }
    setIsGenerating(true);`);
fs.writeFileSync('src/components/DashboardView.tsx', contentDash);

// 4. server.ts
let contentServer = fs.readFileSync('server.ts', 'utf-8');
const targetAI = `  async function generateAIContent(aiConfig: any, prompt: string, isJson: boolean = false, systemInstruction?: string, history: any[] = []) {
    let activeConfig = aiConfig;
    if (!activeConfig?.apiKey) {
      if (process.env.GEMINI_API_KEY) {
        activeConfig = { provider: 'gemini', apiKey: process.env.GEMINI_API_KEY, model: 'gemini-2.5-flash' };
      } else {
        throw new Error("Missing API Key");
      }
    }`;
const replaceAI = `  async function generateAIContent(aiConfig: any, prompt: string, isJson: boolean = false, systemInstruction?: string, history: any[] = []) {
    let activeConfig = aiConfig;
    if (!activeConfig?.apiKey) {
      throw new Error("Missing API Key");
    }`;
contentServer = contentServer.replace(targetAI, replaceAI);

const targetModels = `  app.post("/api/models", async (req, res) => {
    try {
      let { aiConfig } = req.body;
      if (!aiConfig?.apiKey) {
        if (process.env.GEMINI_API_KEY) {
          aiConfig = { provider: 'gemini', apiKey: process.env.GEMINI_API_KEY };
        } else {
          throw new Error("Missing API Key");
        }
      }`;
const replaceModels = `  app.post("/api/models", async (req, res) => {
    try {
      let { aiConfig } = req.body;
      if (!aiConfig?.apiKey) {
        throw new Error("Missing API Key");
      }`;
contentServer = contentServer.replace(targetModels, replaceModels);

fs.writeFileSync('server.ts', contentServer);
