const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
`import { AlertModal } from './components/AlertModal';`,
`import { AlertModal } from './components/AlertModal';
import { ImportProgressModal } from './components/ImportProgressModal';`
);

code = code.replace(
`  const [alertMessage, setAlertMessage] = useState<string | null>(null);`,
`  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState<{current: number, total: number} | null>(null);`
);

fs.writeFileSync('src/App.tsx', code);
