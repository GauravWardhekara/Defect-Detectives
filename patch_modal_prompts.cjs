const fs = require('fs');
let code = fs.readFileSync('src/components/DefectFormModal.tsx', 'utf8');

if (!code.includes('PromptModal')) {
  code = code.replace(
    'import { AlertModal } from \'./AlertModal\';',
    'import { AlertModal } from \'./AlertModal\';\nimport { PromptModal } from \'./PromptModal\';'
  );

  const stateToAdd = `
  const [promptConfig, setPromptConfig] = useState<{ isOpen: boolean; title: string; field: string }>({ isOpen: false, title: '', field: '' });
  
  const handlePromptSubmit = (value: string) => {
    const val = value.trim();
    if (!val) {
      setPromptConfig(prev => ({ ...prev, isOpen: false }));
      return;
    }
    
    if (promptConfig.field === 'project') {
      if (!projects.find(p => p.name === val)) {
        addProject(val);
        if (socket) socket.emit("add_project", val);
        setFormData(prev => ({ ...prev, project: val }));
      }
    } else if (promptConfig.field === 'platform') {
      if (!platforms.find(p => p.name === val)) {
        addPlatform(val);
        if (socket) socket.emit("add_platform", val);
        const newPlats = formData.platforms ? [...formData.platforms, val] : [val];
        setFormData(prev => ({ ...prev, platforms: newPlats }));
      }
    } else if (promptConfig.field === 'assignee' || promptConfig.field === 'reporter') {
      const isExisting = users.some(u => u.name.toLowerCase() === val.toLowerCase());
      if (!isExisting) {
        addUser({
          id: \`usr-\${Date.now()}\`,
          name: val,
          email: \`\${val.replace(/\\s+/g, '.').toLowerCase()}@example.com\`,
        });
      }
      setFormData(prev => ({ ...prev, [promptConfig.field]: val }));
    }
    setPromptConfig(prev => ({ ...prev, isOpen: false }));
  };
  `;

  code = code.replace(
    'const fileInputRef = useRef<HTMLInputElement>(null);',
    'const fileInputRef = useRef<HTMLInputElement>(null);' + stateToAdd
  );

  const targetProj = `  const handleAddNewProject = () => {
    const newProj = prompt('Enter new project name:');
    if (newProj && newProj.trim() && !projects.find(p => p.name === newProj.trim())) {
      addProject(newProj.trim());
      if (socket) socket.emit("add_project", newProj.trim());
      setFormData(prev => ({ ...prev, project: newProj.trim() }));
    }
  };`;
  const replaceProj = `  const handleAddNewProject = () => {
    setPromptConfig({ isOpen: true, title: 'Enter new project name:', field: 'project' });
  };`;
  code = code.replace(targetProj, replaceProj);

  const targetPlat = `  const handleAddNewPlatform = () => {
    const newPlat = prompt('Enter new platform name:');
    if (newPlat && newPlat.trim() && !platforms.find(p => p.name === newPlat.trim())) {
      addPlatform(newPlat.trim());
      if (socket) socket.emit("add_platform", newPlat.trim());
      const newPlats = formData.platforms ? [...formData.platforms, newPlat.trim()] : [newPlat.trim()];
      setFormData(prev => ({ ...prev, platforms: newPlats }));
    }
  };`;
  const replacePlat = `  const handleAddNewPlatform = () => {
    setPromptConfig({ isOpen: true, title: 'Enter new platform name:', field: 'platform' });
  };`;
  code = code.replace(targetPlat, replacePlat);

  const targetUser = `  const handleAddNewUser = (field: 'assignee' | 'reporter') => {
    const newName = prompt(\`Enter new \${field} name:\`);
    if (newName && newName.trim()) {
      const isExisting = users.some(u => u.name.toLowerCase() === newName.trim().toLowerCase());
      if (!isExisting) {
        addUser({
          id: \`usr-\${Date.now()}\`,
          name: newName.trim(),
          email: \`\${newName.trim().replace(/\\s+/g, '.').toLowerCase()}@example.com\`,
        });
      }
      setFormData(prev => ({ ...prev, [field]: newName.trim() }));
    }
  };`;
  const replaceUser = `  const handleAddNewUser = (field: 'assignee' | 'reporter') => {
    setPromptConfig({ isOpen: true, title: \`Enter new \${field} name:\`, field });
  };`;
  code = code.replace(targetUser, replaceUser);

  const modalRender = `        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
    </div>`;
  const modalReplace = `        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      <PromptModal 
        isOpen={promptConfig.isOpen} 
        title={promptConfig.title} 
        onClose={() => setPromptConfig(prev => ({ ...prev, isOpen: false }))} 
        onSubmit={handlePromptSubmit} 
      />
    </div>`;
  code = code.replace(modalRender, modalReplace);

  fs.writeFileSync('src/components/DefectFormModal.tsx', code);
}
