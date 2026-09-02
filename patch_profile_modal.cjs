const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

if (!code.includes("import { AlertModal }")) {
  code = code.replace("import { generateProfileCard } from '../lib/profile';", "import { generateProfileCard } from '../lib/profile';\nimport { AlertModal } from './AlertModal';");
}

code = code.replace("const [editDept, setEditDept] = useState(currentUser?.department || '');", "const [editDept, setEditDept] = useState(currentUser?.department || '');\n  const [alertMessage, setAlertMessage] = useState<string | null>(null);");

code = code.replace(
`      alert('Profile updated and saved locally!');`,
`      setAlertMessage('Profile updated and saved locally!');`
);

code = code.replace(
`      </div>
    </div>
  );`,
`      </div>
      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => {
          setAlertMessage(null);
          onClose();
        }} />
      )}
    </div>
  );`
);

fs.writeFileSync('src/components/ProfileModal.tsx', code);
