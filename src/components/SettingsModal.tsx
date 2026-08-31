import React, { useState } from 'react';
import { X, Shield, Users, Copy, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const { users, networkConfig } = useAppContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (networkConfig?.inviteCode) {
      navigator.clipboard.writeText(networkConfig.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

          <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
            <h3 className="font-bold mb-1">Local Encryption Active</h3>
            <p className="text-sm">
              Your defect data is encrypted at rest using AES-256-CBC. Master keys are kept locally, ensuring no cloud dependency.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
