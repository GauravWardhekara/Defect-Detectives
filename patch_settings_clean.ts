import fs from 'fs';
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf-8');

const funcsStr = `  const [newProject, setNewProject] = useState('');
  const [editingProject, setEditingProject] = useState<{old: string, new: string} | null>(null);

  const handleAddProject = () => {
    if (newProject.trim() && !projects.includes(newProject.trim())) {
      if (socket) socket.emit('add_project', newProject.trim());
      setNewProject('');
    }
  };

  const handleUpdateProject = () => {
    if (editingProject && editingProject.new.trim() && !projects.includes(editingProject.new.trim()) && editingProject.new !== editingProject.old) {
      if (socket) socket.emit('update_project', { oldName: editingProject.old, newName: editingProject.new.trim() });
      setEditingProject(null);
    }
  };`;

content = content.replace(funcsStr, '');
fs.writeFileSync('src/components/SettingsModal.tsx', content);
