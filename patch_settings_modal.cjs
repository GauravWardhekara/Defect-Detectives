const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

if (!code.includes('AlertModal')) {
  code = code.replace(
    'import { useAppContext } from \'../context/AppContext\';',
    'import { useAppContext } from \'../context/AppContext\';\nimport { AlertModal } from \'./AlertModal\';'
  );

  code = code.replace(
    'const [testMessage, setTestMessage] = useState(\'\');',
    'const [testMessage, setTestMessage] = useState(\'\');\n  const [alertMessage, setAlertMessage] = useState<string | null>(null);'
  );

  const catchTarget = `    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.message);
      setAvailableModels([]);
    }`;
  const catchReplace = `    } catch (err: any) {
      setTestStatus('error');
      setAvailableModels([]);
      const errMsg = err.message || "";
      if (errMsg.includes("API Key") || errMsg.includes("Model") || errMsg.includes("Invalid") || errMsg.includes("Missing") || errMsg.includes("Deprecated")) {
        setAlertMessage(\`\${errMsg}. Please check your credentials and model selections.\`);
        setTestMessage("Configuration error detected.");
      } else {
        setTestMessage(errMsg);
      }
    }`;
  code = code.replace(catchTarget, catchReplace);

  const jsxTarget = `      <div className="bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-ink-faint w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">`;
  const jsxReplace = `      {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />}
      <div className="bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-ink-faint w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">`;
  code = code.replace(jsxTarget, jsxReplace);

  fs.writeFileSync('src/components/SettingsModal.tsx', code);
}
