import React, { useState, useRef } from 'react';
import { Wifi, Loader2, Server, Computer, User, ShieldCheck, Upload } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { parseProfileCard } from '../lib/profile';

export const NetworkConnect = () => {
  const { networkConfig, socket, currentUser, saveProfile, importProfile, authStatus, joinOrg } = useAppContext();
  
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const user = parseProfileCard(content);
      if (user) {
        importProfile(user);
      } else {
        alert("Invalid or corrupted profile card.");
      }
    };
    reader.readAsText(file);
  };

  const [isScanning, setIsScanning] = useState(true);
  const [scanTimeout, setScanTimeout] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!networkConfig) {
        setScanTimeout(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [networkConfig]);

  const handleForceHost = async () => {
    try {
      await fetch('/api/promote', { method: 'POST' });
      window.location.reload();
    } catch (err) {
      console.error(err);
      window.location.reload();
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-slate-100 flex items-center justify-center p-4 rounded-2xl shadow-xl border border-slate-100 min-h-[400px]">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Your Profile</h1>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">
            Enter your details to identify yourself on the network. A secure profile card will be downloaded for backup.
          </p>
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                placeholder="e.g. Alex Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                placeholder="e.g. Quality Assurance"
              />
            </div>
            <button
              onClick={() => { if (name && department) saveProfile(name, department); }}
              disabled={!name || !department}
              className="w-full bg-indigo-600 text-white font-medium rounded-lg px-4 py-3 hover:bg-indigo-700 disabled:opacity-50 transition-colors mt-2"
            >
              Save & Continue
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
            <input 
              type="file" 
              accept=".ddprofile" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImport}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-600 text-sm font-medium flex items-center justify-center gap-2 w-full hover:bg-indigo-50 py-2 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              Restore Profile from Card
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 flex items-center justify-center p-4 rounded-2xl shadow-xl border border-slate-100 min-h-[400px]">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
        {!networkConfig ? (
          <>
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Scanning LAN...</h1>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              Searching for an existing Defect Diary server on your local network.
            </p>
            {scanTimeout && (
              <div className="mt-4 animate-fade-in">
                <p className="text-amber-600 text-sm font-medium mb-4">
                  Scanning is taking longer than expected. You can continue waiting, or stop scanning and host your own workspace.
                </p>
                <button
                  onClick={handleForceHost}
                  className="w-full bg-slate-900 text-white font-medium rounded-lg px-4 py-3 hover:bg-slate-800 transition-colors"
                >
                  Stop & Host Workspace
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className={`w-16 h-16 ${networkConfig.isMaster ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
              {networkConfig.isMaster ? <Server className="w-8 h-8" /> : <Computer className="w-8 h-8" />}
            </div>
            
            {networkConfig.isMaster ? (
              <>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Hosting Server</h1>
                <p className="text-slate-500 mb-4 text-sm leading-relaxed">
                  You are the Master server. Share this invite code with your team so they can join this workspace securely.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 relative group">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Invite Code</div>
                  <div className="text-3xl font-mono font-bold text-indigo-600 tracking-[0.2em]">{networkConfig.inviteCode}</div>
                  <button 
                    onClick={() => {
                      if (networkConfig?.inviteCode) navigator.clipboard.writeText(networkConfig.inviteCode);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Copy Invite Code"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                {authStatus === 'success' ? (
                  <>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Connected to Server</h1>
                    <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                      Successfully connected and authenticated to the Master server at {networkConfig.masterUrl}
                    </p>
                    <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 mb-6">
                      <ShieldCheck className="w-5 h-5" />
                      Workspace Access Granted
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Join Workspace</h1>
                    <p className="text-slate-500 mb-4 text-sm leading-relaxed">
                      Enter the invite code from the Master server to join the {networkConfig.masterUrl} workspace.
                    </p>
                    <div className="mb-6">
                      <input
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        className="w-full text-center text-2xl font-mono tracking-widest border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow uppercase"
                        placeholder="XXXXXX"
                      />
                      <button
                        onClick={() => joinOrg(inviteCode)}
                        disabled={!inviteCode || inviteCode.length < 4}
                        className="w-full mt-4 bg-indigo-600 text-white font-medium rounded-lg px-4 py-3 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        Join Workspace
                      </button>
                    </div>
                    {authStatus === 'failed' && (
                      <p className="text-red-500 text-sm font-medium mb-4">Invalid Invite Code. Please try again.</p>
                    )}
                    
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500 mb-3">Don't want to join this network?</p>
                      <button
                        onClick={handleForceHost}
                        className="w-full bg-white border border-slate-200 text-slate-700 font-medium rounded-lg px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Server className="w-4 h-4" />
                        Host Your Own Workspace
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 mt-4 border-t border-slate-100 pt-4">
              <Wifi className={`w-4 h-4 ${socket?.connected ? 'text-green-500' : 'text-slate-400'}`} />
              {socket?.connected ? 'WebSocket Connected' : 'Connecting WebSocket...'}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

