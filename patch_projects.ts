import fs from 'fs';
let content = fs.readFileSync('src/components/ProjectConfigurationsView.tsx', 'utf-8');

const updatedProjects = `import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FolderGit2, Trash2, Edit2, Check, X, ArrowLeft } from 'lucide-react';
import { Project } from '../types';

export const ProjectConfigurationsView = () => {
  const { projects, addProject, deleteProject, socket, filteredDefects } = useAppContext();
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = () => {
    if (newProjectName.trim() && !projects.find(p => p.name === newProjectName.trim())) {
      addProject(newProjectName.trim());
      if (socket) socket.emit('add_project', newProjectName.trim());
      setNewProjectName('');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project? All associated defects will be deleted permanently.")) {
      deleteProject(id);
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
    }
  };

  const handleUpdate = () => {
    if (selectedProject && editingName.trim() && editingName !== selectedProject.name && !projects.find(p => p.name === editingName.trim())) {
      if (socket) socket.emit('update_project', { id: selectedProject.id, newName: editingName.trim() });
      setSelectedProject({ ...selectedProject, name: editingName.trim() });
      setEditingName('');
    }
  };

  if (selectedProject) {
    const projDefects = filteredDefects.filter(d => d.project === selectedProject.name);
    return (
      <div className="flex flex-col h-full bg-white rounded-[24px]">
        <div className="p-10 border-b border-ink-faint">
          <button onClick={() => setSelectedProject(null)} className="flex items-center gap-2 text-ink-muted hover:text-ink mb-6 transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-[1.75rem] mb-2">{selectedProject.name}</h3>
              <p className="text-[0.85rem] text-ink-muted leading-[1.4] max-w-[400px]">ID: {selectedProject.id}</p>
            </div>
            <div className="flex gap-4 items-center">
              <input 
                type="text" 
                value={editingName} 
                onChange={(e) => setEditingName(e.target.value)} 
                placeholder={selectedProject.name}
                className="border-none border-b-[1.5px] border-ink-faint py-2 text-base w-[240px] outline-none transition-colors focus:border-ink bg-transparent"
              />
              <button 
                onClick={handleUpdate}
                disabled={!editingName.trim() || editingName === selectedProject.name || projects.some(p => p.name === editingName.trim())}
                className="px-6 py-2.5 bg-ink text-white rounded-full font-medium text-xs hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>

        <div className="p-10">
          <h3 className="text-lg font-medium text-ink mb-4">Project Stats</h3>
          <div className="flex justify-between items-center bg-bg-base p-6 rounded-[16px] border border-ink-faint max-w-sm">
            <span className="text-ink-muted font-medium text-sm">Total Defects</span>
            <span className="text-2xl font-serif font-bold text-ink">{projDefects.length}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-[24px]">
      <div className="p-10 flex justify-between items-start border-b border-ink-faint">
        <div className="max-w-[400px]">
          <h3 className="font-serif text-[1.75rem] mb-2">Project Configurations</h3>
          <p className="text-[0.85rem] text-ink-muted leading-[1.4]">Monitoring defects across all enterprise platforms. Manage workspace projects and identifiers below.</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <input 
            type="text" 
            value={newProjectName} 
            onChange={(e) => setNewProjectName(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Project name" 
            className="border-none border-b-[1.5px] border-ink-faint py-2 text-base w-[240px] outline-none transition-colors focus:border-ink bg-transparent"
          />
          <button 
            onClick={handleAdd}
            disabled={!newProjectName.trim() || projects.some(p => p.name === newProjectName.trim())}
            className="px-6 py-2.5 bg-ink text-white rounded-full font-medium text-sm hover:opacity-90 disabled:opacity-50"
          >
            Add Project
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left px-10 py-4 text-[0.7rem] uppercase tracking-[0.15em] text-ink-muted border-b border-ink-faint">Project Detail</th>
              <th className="text-left px-10 py-4 text-[0.7rem] uppercase tracking-[0.15em] text-ink-muted border-b border-ink-faint">Identity</th>
              <th className="text-right px-10 py-4 text-[0.7rem] uppercase tracking-[0.15em] text-ink-muted border-b border-ink-faint">Control</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-ink-muted py-20 border-b border-ink-faint">
                  <span className="font-mono text-[0.7rem] uppercase tracking-widest">[ No active projects in registry ]</span>
                </td>
              </tr>
            ) : (
              projects.map(project => (
                <tr key={project.id}>
                  <td className="px-10 py-6 border-b border-ink-faint text-[0.95rem]">
                    <button 
                      onClick={() => { setSelectedProject(project); setEditingName(''); }}
                      className="font-medium text-ink hover:opacity-70 flex items-center gap-3 transition-opacity"
                    >
                      <FolderGit2 className="w-4 h-4 text-ink-muted" /> {project.name}
                    </button>
                  </td>
                  <td className="px-10 py-6 border-b border-ink-faint text-sm text-ink-muted font-mono">{project.id}</td>
                  <td className="px-10 py-6 border-b border-ink-faint text-right">
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-ink-muted hover:text-red-500 rounded-full transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/ProjectConfigurationsView.tsx', updatedProjects);
