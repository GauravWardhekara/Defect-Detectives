const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

if (!code.includes('AlertModal')) {
  code = code.replace(
    'import { useAppContext } from \'../context/AppContext\';',
    'import { useAppContext } from \'../context/AppContext\';\nimport { AlertModal } from \'./AlertModal\';'
  );
  
  code = code.replace(
    'const [isLoading, setIsLoading] = useState(false);',
    'const [isLoading, setIsLoading] = useState(false);\n  const [alertMessage, setAlertMessage] = useState<string | null>(null);'
  );

  const fetchTarget = `      if (!response.ok) {
        throw new Error('Failed to get chat response');
      }`;
  const fetchReplace = `      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to get chat response');
      }`;
  code = code.replace(fetchTarget, fetchReplace);

  const catchTarget = `    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
    }`;
  const catchReplace = `    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || "";
      if (errMsg.includes("API Key") || errMsg.includes("Model") || errMsg.includes("Invalid") || errMsg.includes("Missing")) {
        setAlertMessage(\`\${errMsg}. Please update your settings in the AI Configuration.\`);
        setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an authentication error. Please check your AI config.' }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
      }
    }`;
  code = code.replace(catchTarget, catchReplace);

  const modalTarget = `      {isOpen && (`;
  const modalReplace = `      {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />}
      {isOpen && (`;
  code = code.replace(modalTarget, modalReplace);
  
  fs.writeFileSync('src/components/Chatbot.tsx', code);
}
