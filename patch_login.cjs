const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

if (!code.includes("import { AlertModal }")) {
  code = code.replace("import { Activity, Shield, Users, Server, HardDrive } from 'lucide-react';", "import { Activity, Shield, Users, Server, HardDrive } from 'lucide-react';\nimport { AlertModal } from './AlertModal';");
}

code = code.replace("const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');", "const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');\n  const [alertMessage, setAlertMessage] = useState<string | null>(null);");

code = code.replace(
`      alert('Cannot host workspace. This device does not have the backend server running. You must run the desktop app or standard server to host.');`,
`      setAlertMessage('Cannot host workspace. This device does not have the backend server running. You must run the desktop app or standard server to host.');`
);

code = code.replace(
`    </div>
  );
};`,
`      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
    </div>
  );
};`
);

fs.writeFileSync('src/components/Login.tsx', code);
