import fs from 'fs';

let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf-8');

const target1 = `  const { users, networkConfig, aiConfig, setAiConfig } = useAppContext();`;
const replace1 = `  const { users, projects, socket, networkConfig, aiConfig, setAiConfig } = useAppContext();
  const [newProject, setNewProject] = useState('');
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
  };
`;
content = content.replace(target1, replace1);

const target2 = `import { X, Shield, Users, Copy, Check, Cpu } from 'lucide-react';`;
const replace2 = `import { X, Shield, Users, Copy, Check, Cpu, FolderGit2, Edit2, Check as CheckIcon } from 'lucide-react';`;
content = content.replace(target2, replace2);

const target3 = `          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              Whitelisted Users ({users.length})
            </h3>`;
const replace3 = `          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-slate-500" />
              Workspace Projects ({projects.length})
            </h3>
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 bg-slate-50 mb-6">
              {projects.map(project => (
                <div key={project} className="p-3 flex items-center justify-between bg-white first:rounded-t-lg last:rounded-b-lg">
                  {editingProject?.old === project ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={editingProject.new}
                        onChange={(e) => setEditingProject({...editingProject, new: e.target.value})}
                        className="flex-1 bg-slate-50 border border-indigo-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateProject()}
                      />
                      <button onClick={handleUpdateProject} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <CheckIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingProject(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm font-semibold text-slate-800">{project}</div>
                      {networkConfig?.isMaster && (
                        <button onClick={() => setEditingProject({old: project, new: project})} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
              {networkConfig?.isMaster && (
                <div className="p-3 flex items-center gap-2 bg-slate-50 rounded-b-lg">
                  <input
                    type="text"
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    placeholder="New project name..."
                    className="flex-1 bg-white border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                  />
                  <button
                    onClick={handleAddProject}
                    disabled={!newProject.trim() || projects.includes(newProject.trim())}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              Whitelisted Users ({users.length})
            </h3>`;
content = content.replace(target3, replace3);

fs.writeFileSync('src/components/SettingsModal.tsx', content);
