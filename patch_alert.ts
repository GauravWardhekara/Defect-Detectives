import fs from 'fs';

let content = fs.readFileSync('src/components/Login.tsx', 'utf-8');

// Add error state
content = content.replace(
  `  const [inviteCode, setInviteCode] = useState('');`,
  `  const [inviteCode, setInviteCode] = useState('');
  const [importError, setImportError] = useState('');`
);

// Replace alert
content = content.replace(
  `        alert("Invalid or corrupted profile card.");`,
  `        setImportError("Invalid or corrupted profile card. Please try again.");`
);

// Clear error on file select
content = content.replace(
  `  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {`,
  `  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');`
);

// Display error below the button
content = content.replace(
  `              Restore Profile from Card
            </button>`,
  `              Restore Profile from Card
            </button>
            {importError && (
              <p className="text-red-500 text-xs font-medium text-center mt-2">{importError}</p>
            )}`
);

fs.writeFileSync('src/components/Login.tsx', content);
