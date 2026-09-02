import React, { useState } from 'react';
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <button onClick={() => setSelectedProject(null)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{selectedProject.name}</h2>
              <p className="text-sm text-slate-500">ID: {selectedProject.id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Edit Project</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={editingName} 
                onChange={(e) => setEditingName(e.target.value)} 
                placeholder={selectedProject.name}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={handleUpdate}
                disabled={!editingName.trim() || editingName === selectedProject.name || projects.some(p => p.name === editingName.trim())}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Project Stats</h3>
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium">Total Defects</span>
              <span className="text-2xl font-bold text-indigo-600">{projDefects.length}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Recent Activity</h3>
          {/* Note: In a real app we'd filter audit logs, here we just show a placeholder or filter defect edits */}
          <div className="text-slate-500 italic text-sm">Activity logs for this project will appear here.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Project Configurations</h2>
        <p className="text-sm text-slate-500 mb-6">Manage workspace projects, unique identifiers, and configurations.</p>
        
        <div className="flex gap-3">
          <input 
            type="text" 
            value={newProjectName} 
            onChange={(e) => setNewProjectName(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="New project name..." 
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={handleAdd}
            disabled={!newProjectName.trim() || projects.some(p => p.name === newProjectName.trim())}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Add Project
          </button>
        </div>
      </div>

      <div className="p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Name</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project ID</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500">No projects defined. Add one above.</td>
              </tr>
            ) : (
              projects.map(project => (
                <tr key={project.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <button 
                      onClick={() => { setSelectedProject(project); setEditingName(''); }}
                      className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                    >
                      <FolderGit2 className="w-4 h-4" /> {project.name}
                    </button>
                  </td>
                  <td className="p-4 text-sm text-slate-500 font-mono">{project.id}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
