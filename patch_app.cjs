const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("import Papa from 'papaparse';", "import Papa from 'papaparse';\nimport { AlertModal } from './components/AlertModal';");
code = code.replace("const [isProfileOpen, setIsProfileOpen] = useState(false);", "const [isProfileOpen, setIsProfileOpen] = useState(false);\n  const [alertMessage, setAlertMessage] = useState<string | null>(null);");

code = code.replace(
`            if (!userInput.trim()) {
              alert("A project name is required to import these defects.");
              return;
            }`,
`            if (!userInput.trim()) {
              setAlertMessage("A project name is required to import these defects.");
              return;
            }`
);

code = code.replace(
`            onClick={() => {
              if (projects.length === 0) {
                alert("There are no Projects. Please add a project to continue.");
                setActiveView('projects');
              } else {
                fileInputRef.current?.click();
              }
            }}`,
`            onClick={() => {
              if (projects.length === 0) {
                setAlertMessage("There are no Projects. Please add a project to continue.");
                setActiveView('projects');
              } else {
                fileInputRef.current?.click();
              }
            }}`
);

code = code.replace(
`            onClick={() => {
              if (projects.length === 0) {
                alert("There are no Projects. Please add a project to continue.");
                setActiveView('projects');
              } else {
                setSelectedDefect(undefined); 
                setIsFormOpen(true);
              }
            }}`,
`            onClick={() => {
              if (projects.length === 0) {
                setAlertMessage("There are no Projects. Please add a project to continue.");
                setActiveView('projects');
              } else {
                setSelectedDefect(undefined); 
                setIsFormOpen(true);
              }
            }}`
);

const modalInjection = `      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md">
            {networkConfig && socket && (
              <button 
                onClick={() => setIsConnectModalOpen(false)}
                className="absolute -top-4 -right-4 w-8 h-8 bg-white text-slate-500 hover:text-slate-900 rounded-full shadow-lg flex items-center justify-center transition-colors z-10"
              >
                &times;
              </button>
            )}
            <NetworkConnect />
          </div>
        </div>
      )}
      
      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}`;

code = code.replace(
`      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md">
            {networkConfig && socket && (
              <button 
                onClick={() => setIsConnectModalOpen(false)}
                className="absolute -top-4 -right-4 w-8 h-8 bg-white text-slate-500 hover:text-slate-900 rounded-full shadow-lg flex items-center justify-center transition-colors z-10"
              >
                &times;
              </button>
            )}
            <NetworkConnect />
          </div>
        </div>
      )}`,
modalInjection
);

fs.writeFileSync('src/App.tsx', code);
