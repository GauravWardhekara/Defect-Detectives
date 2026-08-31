import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X, Check, Save, Plus, Camera as CameraIcon, Upload, Trash2, Sparkles, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Defect, Priority, Severity, Status } from '../types';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { GoogleGenAI } from '@google/genai';

interface DefectFormModalProps {
  existingDefect?: Defect;
  onClose: () => void;
  onAutoSave?: () => void;
}

const STATUS_STAGES = [
  Status.OPEN,
  Status.IN_PROGRESS,
  Status.IN_REVIEW,
  Status.QA_TESTING,
  Status.RESOLVED,
  Status.CLOSED,
];

export const DefectFormModal = ({ existingDefect, onClose, onAutoSave }: DefectFormModalProps) => {
  const { addDefect, updateDefect, deleteDefect, projects, users, currentUser, addProject, addUser, networkConfig } = useAppContext();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isInitialMount = useRef(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      assignee: users.length > 0 ? users[0].name : '',
      reportedVersion: '',
      targetFixVersion: '',
      reproductionSteps: '',
      expectedBehavior: '',
      actualBehavior: '',
      rootCauseAnalysis: '',
      resolutionNotes: ''
    }
  );

  // Auto-save effect
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (existingDefect) {
      setSaveStatus('saving');
      const timer = setTimeout(() => {
        const now = new Date().toISOString();
        const updated = { ...(formData as Defect), updatedAt: now };
        updateDefect(updated);
        if (onAutoSave) onAutoSave();
        setSaveStatus('saved');
        
        setTimeout(() => setSaveStatus('idle'), 2500);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [formData, existingDefect]); // We omit updateDefect and onAutoSave from deps intentionally

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    
    if (!existingDefect) {
      const newDefect: Defect = {
        ...(formData as Defect),
        id: `DEF-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 10)}`,
        reporter: formData.reporter || currentUser?.name || 'Unknown',
        createdAt: now,
        updatedAt: now
      };
      addDefect(newDefect);
      if (onAutoSave) onAutoSave();
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDelete = () => {
    if (existingDefect) {
      deleteDefect(existingDefect.id);
      if (onAutoSave) onAutoSave();
      onClose();
    }
  };

  const handleAnalyze = async () => {
    if (!formData.title && !formData.description) {
      alert("Please enter a title and description first.");
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      const baseUrl = networkConfig?.masterUrl && !networkConfig.isMaster ? networkConfig.masterUrl : '';
      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          project: formData.project
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze defect');
      }

      const result = await response.json();
      setFormData(prev => ({
        ...prev,
        rootCauseAnalysis: prev.rootCauseAnalysis || result.rootCauseAnalysis || '',
        resolutionNotes: prev.resolutionNotes || result.resolutionNotes || ''
      }));
    } catch (e) {
      console.error("Gemini API Error", e);
      alert("Failed to analyze defect. Please check your connection and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      // Check permissions first
      const permissions = await Camera.checkPermissions();
      
      if (permissions.camera !== 'granted') {
        const request = await Camera.requestPermissions();
        if (request.camera !== 'granted') {
          console.log('Camera permission denied');
          alert('Camera permission is required to take photos.');
          return;
        }
      }

      const image = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 800
      });
      if (image.dataUrl) {
        setFormData(prev => ({ ...prev, imageUrl: image.dataUrl }));
      }
    } catch (e) {
      console.log('User cancelled or camera error', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData(prev => ({ ...prev, imageUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Photo / File Attachment</label>
                <div className="flex flex-col gap-3">
                  {formData.imageUrl && (
                    <div className="relative inline-block border border-slate-200 rounded-lg overflow-hidden w-full max-w-sm">
                      <img src={formData.imageUrl} alt="Defect Attachment" className="w-full h-auto object-cover" />
                      <button type="button" onClick={() => setFormData(prev => ({...prev, imageUrl: ''}))} className="absolute top-2 right-2 p-1 bg-white/90 rounded-full shadow-sm text-slate-600 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button type="button" onClick={handleTakePhoto} className="flex flex-1 items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg transition-colors max-w-sm font-medium">
                      <CameraIcon className="w-4 h-4" />
                      {formData.imageUrl ? 'Retake Photo' : 'Capture Photo'}
                    </button>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-1 items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg transition-colors max-w-sm font-medium">
                      <Upload className="w-4 h-4" />
                      Upload File
                    </button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Comments</label>
                <textarea name="comments" rows={2} value={formData.comments || ''} onChange={handleChange} placeholder="Add any comments or discussion..." className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>

              {existingDefect && (
                <>
                  <div className="col-span-1 md:col-span-2 border-t border-slate-200 pt-6 mt-2 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">Resolution & RCA</h3>
                    <button
                      type="button"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                    </button>
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

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4 text-sm">
            {existingDefect && (
              <button 
                type="button" 
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
            {existingDefect && saveStatus === 'saving' && (
              <span className="text-slate-500 font-medium animate-pulse flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-indigo-600 animate-spin"></span>
                Saving...
              </span>
            )}
            {existingDefect && saveStatus === 'saved' && (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <Check className="w-4 h-4"/> Saved to Google Sheets
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">
              {existingDefect ? 'Close' : 'Cancel'}
            </button>
            {!existingDefect && (
              <button type="submit" form="defect-form" className="px-6 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">
                Create Defect
              </button>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Delete Defect</h3>
            </div>
            <p className="text-slate-600 text-sm mb-6">
              Are you sure you want to delete this defect? This action cannot be undone and will permanently remove the defect from the registry.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg shadow-sm transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
