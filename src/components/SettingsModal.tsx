import React, { useState } from 'react';
import { X, Shield, Users, Copy, Check, Cpu, FolderGit2, Edit2, Check as CheckIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AlertModal } from './AlertModal';
import { AIProvider } from '../types';

export const SettingsModal = ({ onClose, onNavigateToProjects }: { onClose: () => void, onNavigateToProjects?: () => void }) => {
  const { users, projects, socket, networkConfig, aiConfig, setAiConfig } = useAppContext();


  const [copied, setCopied] = useState(false);

  const [provider, setProvider] = useState<AIProvider>(aiConfig?.provider || 'gemini');
  const [apiKey, setApiKey] = useState(aiConfig?.apiKey || '');
  const [model, setModel] = useState(aiConfig?.model || 'gemini-2.5-flash');
  const [baseUrl, setBaseUrl] = useState(aiConfig?.baseUrl || '');
  
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

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
      setAvailableModels([]);
      const errMsg = err.message || "";
      if (errMsg.includes("API Key") || errMsg.includes("Model") || errMsg.includes("Invalid") || errMsg.includes("Missing") || errMsg.includes("Deprecated")) {
        setAlertMessage(`${errMsg}. Please check your credentials and model selections.`);
        setTestMessage("Configuration error detected.");
      } else {
        setTestMessage(errMsg);
      }
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 border-b border-ink-faint shrink-0" style={{ height: '50px' }}>
          <h2 className="text-[14px] font-bold tracking-tight text-ink flex items-center gap-2">
            <Shield className="w-5 h-5 text-ink" />
            Workspace Settings
          </h2>
          <button onClick={onClose} className="p-2 text-ink-muted hover:text-ink hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto space-y-5">
          
          {networkConfig?.isMaster && (
            <div>
              <h3 className="text-[10px] font-bold text-ink uppercase tracking-wider mb-2">Invite Team Members</h3>
              <div className="p-3 bg-bg-base border border-ink-faint rounded-[12px] flex items-center justify-between" style={{ borderWidth: '0.8px' }}>
                <div>
                  <div className="text-[10px] text-ink font-semibold mb-0.5">WORKSPACE INVITE CODE</div>
                  <div className="text-lg font-mono font-bold text-ink tracking-widest">{networkConfig.inviteCode}</div>
                </div>
                <button 
                  onClick={handleCopy}
                  className="p-1.5 bg-white text-ink hover:bg-black/5 rounded-[12px] transition-colors border border-ink-faint shadow-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          

          <div>
            <h3 className="text-[10px] font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
              <Users className="w-3 h-3 text-ink-muted" />
              Whitelisted Users ({users.length})
            </h3>
            <div className="border border-ink-faint rounded-[12px] divide-y divide-ink-faint bg-bg-base" style={{ borderWidth: '0.8px' }}>
              {users.map(user => (
                <div key={user.id} className="p-2 flex items-center justify-between bg-white first:rounded-t-lg last:rounded-b-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold text-ink border border-ink-faint" style={{ borderWidth: '0.8px' }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-ink">{user.name}</div>
                      <div className="text-[10px] text-ink-muted">{user.department}</div>
                    </div>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="p-3 text-[11px] text-ink-muted text-center">No users registered yet.</div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
              <Cpu className="w-3 h-3 text-ink-muted" />
              AI Configuration
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-ink mb-1">Provider</label>
                <select 
                  value={provider} 
                  onChange={handleProviderChange}
                  className="w-full bg-bg-base border border-ink-faint rounded-[12px] px-2.5 py-1.5 text-[11px] focus:outline-none focus:ring-2 focus:ring-ink" style={{ borderWidth: '0.8px' }}
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="custom">Custom / Local (OpenAI Compatible)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-ink mb-1">API Key</label>
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Enter API Key"
                  className="w-full bg-bg-base border border-ink-faint rounded-[12px] px-2.5 py-1.5 text-[11px] focus:outline-none focus:ring-2 focus:ring-ink" style={{ borderWidth: '0.8px' }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-ink mb-1">Model Name</label>
                <select 
                  value={model} 
                  onChange={e => setModel(e.target.value)}
                  className="w-full bg-bg-base border border-ink-faint rounded-[12px] px-2.5 py-1.5 text-[11px] focus:outline-none focus:ring-2 focus:ring-ink" style={{ borderWidth: '0.8px' }}
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
                  <label className="block text-[10px] font-semibold text-ink mb-1">Base URL</label>
                  <input 
                    type="text" 
                    value={baseUrl} 
                    onChange={e => setBaseUrl(e.target.value)}
                    placeholder="e.g. http://localhost:11434/v1"
                    className="w-full bg-bg-base border border-ink-faint rounded-[12px] px-2.5 py-1.5 text-[11px] focus:outline-none focus:ring-2 focus:ring-ink" style={{ borderWidth: '0.8px' }}
                  />
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button 
                  type="button" 
                  onClick={handleTestConnection} 
                  disabled={testStatus === 'testing' || !apiKey}
                  className="w-full py-1.5 bg-black/5 hover:bg-black/10 text-ink font-medium rounded-[12px] text-xs transition-colors border border-ink-faint disabled:opacity-50" style={{ borderWidth: '0.8px' }}
                >
                  {testStatus === 'testing' ? 'Testing Connection...' : 'Test Connection & Load Models'}
                </button>
                
                {testMessage && (
                  <div className={`text-xs p-2 rounded-[16px] ${testStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {testMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 bg-green-50 text-green-800 rounded-[12px] border border-green-200">
            <h3 className="text-[11px] font-bold mb-0.5">Local Encryption Active</h3>
            <p className="text-[10px] leading-relaxed">
              Your defect data is encrypted at rest using AES-256-CBC, and your local profile is secured with the native Web Crypto API (AES-GCM). Master keys are kept locally, ensuring no cloud dependency.
            </p>
          </div>
        </div>

        <div className="border-t border-ink-faint flex items-center justify-center gap-3" style={{ marginTop: '2px', paddingTop: '23px', paddingBottom: '23px' }}>
          <button type="button" onClick={onClose} className="bg-white border border-ink-faint text-slate-700 text-[10px] font-medium rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors" style={{ height: '29.5875px', width: '110.788px', lineHeight: '8px', borderWidth: '0.8px' }}>
            Cancel
          </button>
          <button type="button" onClick={handleSaveAi} className="bg-ink text-white text-[10px] font-medium rounded-full hover:opacity-90 transition-colors flex items-center justify-center" style={{ height: '29.5875px', width: '110.788px', lineHeight: '8px', borderWidth: '0.8px' }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
