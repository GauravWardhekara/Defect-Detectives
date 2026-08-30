import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Defect, Priority, Severity, Status } from '../types';

interface DefectFormModalProps {
  existingDefect?: Defect;
  onClose: () => void;
}

const STATUS_STAGES = [
  Status.OPEN,
  Status.IN_PROGRESS,
  Status.IN_REVIEW,
  Status.QA_TESTING,
  Status.RESOLVED,
  Status.CLOSED,
];

export const DefectFormModal = ({ existingDefect, onClose }: DefectFormModalProps) => {
  const { addDefect, updateDefect, projects, users, currentUser, addProject, addUser } = useAppContext();

  const handleAddNewProject = () => {
    const newProj = prompt('Enter new project name:');
    if (newProj && newProj.trim() && !projects.includes(newProj.trim())) {
      addProject(newProj.trim());
      setFormData(prev => ({ ...prev, project: newProj.trim() }));
    }
  };

  const handleAddNewUser = (field: 'assignee' | 'reporter') => {
    const newName = prompt(`Enter new ${field} name:`);
    if (newName && newName.trim()) {
      const isExisting = users.some(u => u.name.toLowerCase() === newName.trim().toLowerCase());
      if (!isExisting) {
        addUser({
          id: `usr-${Date.now()}`,
          name: newName.trim(),
          email: `${newName.trim().replace(/\s+/g, '.').toLowerCase()}@example.com`,
          department: 'General'
        });
      }
      setFormData(prev => ({ ...prev, [field]: newName.trim() }));
    }
  };

  const [formData, setFormData] = useState<Partial<Defect>>(
    existingDefect || {
      title: '',
      description: '',
      project: projects[0],
      priority: Priority.MEDIUM,
      severity: Severity.MINOR,
      status: Status.OPEN,
      assignee: users[0].name,
      reportedVersion: '',
      targetFixVersion: '',
      reproductionSteps: '',
      expectedBehavior: '',
      actualBehavior: '',
      rootCauseAnalysis: '',
      resolutionNotes: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    
    if (existingDefect) {
      updateDefect({
        ...(formData as Defect),
        updatedAt: now
      });
    } else {
      const newDefect: Defect = {
        ...(formData as Defect),
        id: `DEF-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 10)}`,
        reporter: formData.reporter || currentUser?.name || 'Unknown',
        createdAt: now,
        updatedAt: now
      };
      addDefect(newDefect);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const currentStepIndex = STATUS_STAGES.indexOf(formData.status as Status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">
            {existingDefect ? `Edit Defect: ${existingDefect.id}` : 'Report New Defect'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {existingDefect && (
          <div className="px-6 py-5 border-b border-slate-100 shrink-0 bg-white overflow-x-auto">
            <div className="flex items-center justify-between min-w-[600px] max-w-2xl mx-auto">
              {STATUS_STAGES.map((stage, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={stage} className="flex flex-col items-center relative flex-1">
                    {/* Connecting line */}
                    {index !== STATUS_STAGES.length - 1 && (
                      <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${index < currentStepIndex ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                    )}
                    
                    {/* Circle */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-2 border-2 ${
                      isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 
                      isCurrent ? 'bg-white border-indigo-600 text-indigo-600 shadow-[0_0_0_4px_rgba(79,70,229,0.1)]' : 
                      'bg-white border-slate-300 text-slate-400'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    
                    {/* Label */}
                    <div className={`text-[10px] font-bold uppercase tracking-wider text-center ${
                      isCurrent ? 'text-indigo-700' : 
                      isCompleted ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      {stage.replace('_', ' ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1">
          <form id="defect-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  type="text" name="title" required value={formData.title} onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                <div className="flex gap-2">
                  <select name="project" value={formData.project} onChange={handleChange} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg">
                    {projects.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <button type="button" onClick={handleAddNewProject} className="p-2 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-100" title="Add New Project">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Module</label>
                <input 
                  type="text" name="module" placeholder="e.g. Authentication" value={formData.module || ''} onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
                <div className="flex gap-2">
                  <select name="assignee" value={formData.assignee} onChange={handleChange} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg">
                    {users.map(u => <option key={u.id} value={u.name}>{u.name} ({u.department})</option>)}
                  </select>
                  <button type="button" onClick={() => handleAddNewUser('assignee')} className="p-2 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-100" title="Add New Assignee">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reporter</label>
                <div className="flex gap-2">
                  <select name="reporter" value={formData.reporter || currentUser?.name || ''} onChange={handleChange} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg">
                    {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                  </select>
                  <button type="button" onClick={() => handleAddNewUser('reporter')} className="p-2 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-100" title="Add New Reporter">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                  {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
                <select name="severity" value={formData.severity} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                  {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reported App Version</label>
                <input 
                  type="text" name="reportedVersion" placeholder="e.g. v2.4.0" value={formData.reportedVersion} onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Fix Version</label>
                <input 
                  type="text" name="targetFixVersion" placeholder="e.g. v2.5.0" value={formData.targetFixVersion} onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg" 
                />
              </div>

              {existingDefect && (
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-indigo-50 text-indigo-900 font-semibold">
                    {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Reproduction Steps</label>
                <textarea name="reproductionSteps" rows={3} value={formData.reproductionSteps} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expected Behavior</label>
                <textarea name="expectedBehavior" rows={2} value={formData.expectedBehavior} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Actual Behavior</label>
                <textarea name="actualBehavior" rows={2} value={formData.actualBehavior} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Comments</label>
                <textarea name="comments" rows={2} value={formData.comments || ''} onChange={handleChange} placeholder="Add any comments or discussion..." className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>

              {existingDefect && (
                <>
                  <div className="col-span-1 md:col-span-2 border-t border-slate-200 pt-6 mt-2">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Resolution & RCA</h3>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Root Cause Analysis (RCA)</label>
                    <textarea name="rootCauseAnalysis" rows={3} value={formData.rootCauseAnalysis} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Resolution Notes</label>
                    <textarea name="resolutionNotes" rows={3} value={formData.resolutionNotes} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                  </div>
                </>
              )}
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="submit" form="defect-form" className="px-6 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">
            {existingDefect ? 'Save Changes' : 'Create Defect'}
          </button>
        </div>
      </div>
    </div>
  );
};
