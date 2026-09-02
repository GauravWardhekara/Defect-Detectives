import { AlertModal } from './AlertModal';
import React, { useState, useRef } from 'react';
import { Wifi, Loader2, Server, Computer, User, ShieldCheck, Upload, Share2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { parseProfileCard } from '../lib/profile';

export const NetworkConnect = () => {
  const { networkConfig, socket, currentUser, saveProfile, importProfile, authStatus, joinOrg } = useAppContext();
  
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState('');
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = e.target.files?.[0];
    if (!file) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const user = await parseProfileCard(content);
      if (user) {
        importProfile(user);
      } else {
        setImportError("Invalid or corrupted profile card. Please try again.");
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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
      const res = await fetch('/api/promote', { method: 'POST' });
      if (!res.ok) throw new Error('Cannot host on this environment');
      window.location.reload();
    } catch (err) {
      console.error(err);
      setAlertMessage('Cannot host workspace. This device does not have the backend server running. You must run the desktop app or standard server to host.');
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-bg-base flex items-center justify-center p-4 rounded-[24px] shadow-xl border border-ink-faint min-h-[400px]">
        <div className="bg-white rounded-[24px] max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-black/10 text-ink rounded-[24px] flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8" />
          </div>
          <h1 className="font-sans text-[16px] font-bold tracking-tight text-ink mb-2">Create Your Profile</h1>
          <p className="text-ink-muted mb-6 text-xs leading-relaxed">
            Enter your details to identify yourself on the network. A secure profile card will be downloaded for backup.
          </p>
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] leading-[12.8px] font-semibold text-ink mb-1 uppercase tracking-wider">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-ink-faint rounded-[12px] pt-[6px] pb-[7px] text-[14px] leading-[14px] px-3 focus:ring-2 focus:ring-ink focus:border-ink outline-none transition-shadow"
                placeholder="e.g. Alex Engineer"
              />
            </div>
            <div>
              <label className="block text-[10px] leading-[12.8px] font-semibold text-ink mb-1 uppercase tracking-wider">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-ink-faint rounded-[12px] pt-[6px] pb-[7px] text-[14px] leading-[14px] px-3 focus:ring-2 focus:ring-ink focus:border-ink outline-none transition-shadow"
                placeholder="e.g. Quality Assurance"
              />
            </div>
            <button
              onClick={() => { if (name && department) saveProfile(name, department); }}
              disabled={!name || !department}
              className="w-full h-[30px] leading-[11px] bg-ink text-white rounded-full font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-colors mt-2"
            >
              Save & Continue
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-ink-faint">
            <input 
              type="file" 
              accept=".ddprofile" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImport}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-ink text-sm font-medium flex items-center justify-center gap-2 w-full hover:bg-black/5 py-2 rounded-[12px] transition-colors"
            >
              <Upload className="w-4 h-4" />
              Restore Profile from Card
            </button>
            {importError && (
              <p className="text-red-500 text-xs font-medium text-center mt-2">{importError}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-base flex items-center justify-center p-4 rounded-[24px] shadow-xl border border-ink-faint min-h-[400px]">
      <div className="bg-white rounded-[24px] max-w-md w-full p-6 text-center">
        {!networkConfig ? (
          <>
            <div className="w-16 h-16 bg-black/10 text-ink rounded-[24px] flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h1 className="font-sans text-[16px] font-bold tracking-tight text-ink mb-2">Scanning LAN...</h1>
            <p className="text-ink-muted mb-6 text-xs leading-relaxed">
              Searching for an existing Defect Diary server on your local network.
            </p>
            {scanTimeout && (
              <div className="mt-4 animate-fade-in text-left">
                <p className="text-amber-600 text-sm font-medium mb-4 text-center">
                  Scanning is taking longer than expected. You can continue waiting, connect manually, or host your own workspace.
                </p>
                
                <div className="mb-4">
                  <label className="block text-[10px] leading-[12.8px] font-semibold text-ink mb-1 uppercase tracking-wider">Manual Server URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="manual-url"
                      className="w-full border border-ink-faint rounded-[12px] pt-[6px] pb-[7px] text-[14px] leading-[14px] px-3 focus:ring-2 focus:ring-ink outline-none"
                      placeholder="e.g. http://192.168.1.5:3000"
                    />
                    <button
                      onClick={() => {
                        const url = (document.getElementById('manual-url') as HTMLInputElement).value;
                        if (url) {
                          // Allow forcing a connection by setting network config manually
                          // To avoid full context rewrite, we'll just redirect to it with a query param or save it
                          // but since we rely on the backend for this, we can just save it to localStorage and reload
                          localStorage.setItem('manual_master_url', url);
                          window.location.reload();
                        }
                      }}
                      className="bg-ink text-white px-[20px] h-[30px] leading-[11px] rounded-full text-sm font-medium hover:bg-ink/90 whitespace-nowrap"
                    >
                      Connect
                    </button>
                  </div>
                </div>

                <div className="relative flex py-4 items-center">
                    <div className="flex-grow border-t border-ink-faint"></div>
                    <span className="flex-shrink-0 mx-4 text-ink-muted text-xs">OR</span>
                    <div className="flex-grow border-t border-ink-faint"></div>
                </div>

                <button
                  onClick={handleForceHost}
                  className="w-full bg-ink text-white font-medium rounded-[12px] px-4 py-3 hover:bg-ink/90 transition-colors"
                >
                  Stop & Host Workspace
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className={`w-16 h-16 ${networkConfig.isMaster ? 'bg-black/10 text-ink' : 'bg-green-100 text-green-600'} rounded-[24px] flex items-center justify-center mx-auto mb-6`}>
              {networkConfig.isMaster ? <Server className="w-8 h-8" /> : <Computer className="w-8 h-8" />}
            </div>
            
            {networkConfig.isMaster ? (
              <>
                <h1 className="font-sans text-[16px] font-bold tracking-tight text-ink mb-2">Hosting Server</h1>
                <p className="text-ink-muted mb-4 text-xs leading-relaxed">
                  You are the Master server. Share this invite code with your team so they can join this workspace securely.
                </p>
                <div className="bg-black/5 border border-ink-faint rounded-[16px] p-4 mb-6 relative group">
                  <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">Invite Code</div>
                  <div className="text-3xl font-mono font-bold text-ink tracking-[0.2em]">{networkConfig.inviteCode}</div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        if (networkConfig?.inviteCode) navigator.clipboard.writeText(networkConfig.inviteCode);
                      }}
                      className="p-2 bg-white text-ink hover:bg-black/5 rounded-[12px] transition-colors border border-ink-faint shadow-sm"
                      title="Copy Invite Code"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                    {navigator.share && (
                      <button 
                        onClick={() => {
                          if (networkConfig?.inviteCode) {
                            navigator.share({
                              title: 'Defect Diary Workspace',
                              text: `Join my Defect Diary workspace using this invite code: ${networkConfig.inviteCode}`,
                            }).catch(console.error);
                          }
                        }}
                        className="p-2 bg-white text-ink hover:bg-black/5 rounded-[12px] transition-colors border border-ink-faint shadow-sm"
                        title="Share Invite Code"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {authStatus === 'success' ? (
                  <>
                    <h1 className="font-sans text-[16px] font-bold tracking-tight text-ink mb-2">Connected to Server</h1>
                    <p className="text-ink-muted mb-6 text-xs leading-relaxed">
                      Successfully connected and authenticated to the Master server at {networkConfig.masterUrl}
                    </p>
                    <div className="bg-green-50 text-green-700 p-3 rounded-[12px] text-sm font-medium flex items-center justify-center gap-2 mb-6">
                      <ShieldCheck className="w-5 h-5" />
                      Workspace Access Granted
                    </div>
                    {networkConfig.inviteCode && (
                      <div className="bg-black/5 border border-ink-faint rounded-[16px] p-4 mb-6 relative group">
                        <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-1">Invite Code</div>
                        <div className="text-3xl font-mono font-bold text-ink tracking-[0.2em]">{networkConfig.inviteCode}</div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              if (networkConfig?.inviteCode) navigator.clipboard.writeText(networkConfig.inviteCode);
                            }}
                            className="p-2 bg-white text-ink hover:bg-black/5 rounded-[12px] transition-colors border border-ink-faint shadow-sm"
                            title="Copy Invite Code"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </button>
                          {navigator.share && (
                            <button 
                              onClick={() => {
                                if (networkConfig?.inviteCode) {
                                  navigator.share({
                                    title: 'Defect Diary Workspace',
                                    text: `Join my Defect Diary workspace using this invite code: ${networkConfig.inviteCode}`,
                                  }).catch(console.error);
                                }
                              }}
                              className="p-2 bg-white text-ink hover:bg-black/5 rounded-[12px] transition-colors border border-ink-faint shadow-sm"
                              title="Share Invite Code"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h1 className="font-sans text-[16px] font-bold tracking-tight text-ink mb-2">Join Workspace</h1>
                    <p className="text-ink-muted mb-4 text-xs leading-relaxed">
                      Enter the invite code from the Master server to join the {networkConfig.masterUrl} workspace.
                    </p>
                    <div className="mb-6">
                      <input
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        className="w-full text-center text-[16px] leading-[16px] font-mono tracking-widest border border-ink-faint rounded-[12px] pt-[8px] pb-[9px] px-4 focus:ring-2 focus:ring-ink focus:border-ink outline-none transition-shadow uppercase"
                        placeholder="XXXXXX"
                      />
                      <button
                        onClick={() => joinOrg(inviteCode)}
                        disabled={!inviteCode || inviteCode.length < 4}
                        className="w-full mt-4 h-[30px] leading-[11px] bg-ink text-white rounded-full font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-colors"
                      >
                        Join Workspace
                      </button>
                    </div>
                    {authStatus === 'failed' && (
                      <p className="text-red-500 text-sm font-medium mb-4">Invalid Invite Code. Please try again.</p>
                    )}
                    
                    <div className="pt-4 border-t border-ink-faint">
                      <p className="text-xs text-ink-muted mb-3">Don't want to join this network?</p>
                      <button
                        onClick={handleForceHost}
                        className="w-full h-[30px] leading-[11px] bg-white border border-ink-faint text-ink rounded-full font-medium text-sm hover:bg-black/5 transition-colors flex items-center justify-center gap-2"
                      >
                        <Server className="w-4 h-4" />
                        Host Your Own Workspace
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            <div className="flex items-center justify-center gap-2 text-sm font-medium text-ink mt-4 border-t border-ink-faint pt-4">
              <Wifi className={`w-4 h-4 ${socket?.connected ? 'text-green-500' : 'text-ink-muted'}`} />
              {socket?.connected ? 'WebSocket Connected' : 'Connecting WebSocket...'}
            </div>
          </>
        )}
      </div>
      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
    </div>
  );
};

