import fs from 'fs';

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

let contentForm = fs.readFileSync('src/components/DefectFormModal.tsx', 'utf-8');
contentForm = contentForm.replace(`  const handleAutoFill = async () => {
    if (!aiConfig?.apiKey) {
      alert("Please configure your AI API key in the Workspace Settings first.");
      return;
    }`, `  const handleAutoFill = async () => {`); // Wait, let's just do it cleanly via regex or precise replace. I'll re-read the original files.
