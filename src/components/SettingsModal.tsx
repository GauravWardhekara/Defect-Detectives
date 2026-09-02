import React, { useState } from 'react';
import { X, Shield, Users, Copy, Check, Cpu, FolderGit2, Edit2, Check as CheckIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AIProvider } from '../types';

export const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { users, projects, socket, networkConfig, aiConfig, setAiConfig } = useAppContext();


  const [copied, setCopied] = useState(false);

  const [provider, setProvider] = useState<AIProvider>(aiConfig?.provider || 'gemini');
  const [apiKey, setApiKey] = useState(aiConfig?.apiKey || '');
  const [model, setModel] = useState(aiConfig?.model || 'gemini-2.5-flash');
  const [baseUrl, setBaseUrl] = useState(aiConfig?.baseUrl || '');
  
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const handleCopy = () => {
    if (networkConfig?.inviteCode) {
      navigator.clipboard.writeText(networkConfig.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveAi = () => {
    setAiConfig({ provider, apiKey, model, baseUrl });
    onClose();
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('');
    try {
      const url = networkConfig?.masterUrl ? `${networkConfig.masterUrl}/api/models` : '/api/models';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiConfig: { provider, apiKey, baseUrl } })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch models');
      setAvailableModels(data.models);
      setTestStatus('success');
      setTestMessage('Connection successful! Models loaded.');
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.message);
      setAvailableModels([]);
    }
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value as AIProvider;
    setProvider(newProvider);
    if (newProvider === 'gemini') {
      setModel('gemini-2.5-flash');
      setBaseUrl('');
    } else if (newProvider === 'openai') {
      setModel('gpt-4o');
      setBaseUrl('');
    } else if (newProvider === 'anthropic') {
      setModel('claude-3-5-sonnet-20240620');
      setBaseUrl('');
    } else {
      setModel('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Workspace Settings
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8">
          
          {networkConfig?.isMaster && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Invite Team Members</h3>
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-indigo-600 font-semibold mb-1">WORKSPACE INVITE CODE</div>
                  <div className="text-2xl font-mono font-bold text-indigo-900 tracking-widest">{networkConfig.inviteCode}</div>
                </div>
                <button 
                  onClick={handleCopy}
                  className="p-2 bg-white text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200 shadow-sm"
                >
                  {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          <div>
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
            </h3>
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 bg-slate-50">
              {users.map(user => (
                <div key={user.id} className="p-3 flex items-center justify-between bg-white first:rounded-t-lg last:rounded-b-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 border border-slate-200">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.department}</div>
                    </div>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="p-4 text-sm text-slate-500 text-center">No users registered yet.</div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-500" />
              AI Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Provider</label>
                <select 
                  value={provider} 
                  onChange={handleProviderChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="custom">Custom / Local (OpenAI Compatible)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">API Key</label>
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Enter API Key"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Model Name</label>
                <select 
                  value={model} 
                  onChange={e => setModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {availableModels.length === 0 ? (
                    <option value={model || ""}>{model || "-- Empty (Test Connection to Load) --"}</option>
                  ) : (
                    Array.from(new Set(model ? [model, ...availableModels] : availableModels)).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))
                  )}
                </select>
              </div>

              {provider === 'custom' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Base URL</label>
                  <input 
                    type="text" 
                    value={baseUrl} 
                    onChange={e => setBaseUrl(e.target.value)}
                    placeholder="e.g. http://localhost:11434/v1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button 
                  type="button" 
                  onClick={handleTestConnection} 
                  disabled={testStatus === 'testing' || !apiKey}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition-colors border border-slate-200 disabled:opacity-50"
                >
                  {testStatus === 'testing' ? 'Testing Connection...' : 'Test Connection & Load Models'}
                </button>
                
                {testMessage && (
                  <div className={`text-xs p-2 rounded-lg ${testStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {testMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
            <h3 className="font-bold mb-1">Local Encryption Active</h3>
            <p className="text-sm">
              Your defect data is encrypted at rest using AES-256-CBC, and your local profile is secured with the native Web Crypto API (AES-GCM). Master keys are kept locally, ensuring no cloud dependency.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-white text-slate-700 font-medium hover:bg-slate-100 rounded-lg shadow-sm border border-slate-200 transition-colors flex items-center gap-2">
            Cancel
          </button>
          <button type="button" onClick={handleSaveAi} className="px-6 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
