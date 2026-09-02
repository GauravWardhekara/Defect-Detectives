const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

const targetStr = `  if (!isOpen) {
    return (
      <button`;

const replacementStr = `  if (!isOpen) {
    return (
      <>
      {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />}
      <button`;

code = code.replace(targetStr, replacementStr);

const targetStr2 = `        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-10 right-16 z-50">`;

const replacementStr2 = `        <MessageSquare className="w-6 h-6" />
      </button>
      </>
    );
  }

  return (
    <div className="fixed bottom-10 right-16 z-50">
      {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />}`;

code = code.replace(targetStr2, replacementStr2);

fs.writeFileSync('src/components/Chatbot.tsx', code);
