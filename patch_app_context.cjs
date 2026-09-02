const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

if (!code.includes("import { AlertModal }")) {
  code = code.replace("import { Defect, Project, User, AuditLog, Status } from '../types';", "import { Defect, Project, User, AuditLog, Status } from '../types';\nimport { AlertModal } from '../components/AlertModal';");
}

code = code.replace("const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');", "const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');\n  const [alertMessage, setAlertMessage] = useState<string | null>(null);");

code = code.replace(/alert\(`/g, "setAlertMessage(`");

code = code.replace(
`  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};`,
`  return (
    <AppContext.Provider value={value}>
      {children}
      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
    </AppContext.Provider>
  );
};`
);

fs.writeFileSync('src/context/AppContext.tsx', code);
