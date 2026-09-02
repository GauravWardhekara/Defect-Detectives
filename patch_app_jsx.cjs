const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}`;

const replacementStr = `      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      
      {importProgress && (
        <ImportProgressModal current={importProgress.current} total={importProgress.total} />
      )}`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', code);
