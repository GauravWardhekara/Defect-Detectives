import fs from 'fs';

let contentForm = fs.readFileSync('src/components/DefectFormModal.tsx', 'utf-8');
contentForm = contentForm.replace(`  const handleAnalyze = async () => {
    if (!formData.title && !formData.description) {
      alert("Please enter a title and description first.");
      return;
    }
    
    setIsAnalyzing(true);`, `  const handleAnalyze = async () => {
    if (!formData.title && !formData.description) {
      alert("Please enter a title and description first.");
      return;
    }

    if (!aiConfig?.apiKey) {
      alert("Please configure your AI API key in the Workspace Settings first.");
      return;
    }
    
    setIsAnalyzing(true);`);
fs.writeFileSync('src/components/DefectFormModal.tsx', contentForm);
