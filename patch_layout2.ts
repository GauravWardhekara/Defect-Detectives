import fs from 'fs';
let content = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

// Tooltips and Reposition Profile Button
const updatedLayout = `import React from 'react';
import { 
  Activity, LayoutDashboard, List, Settings, FolderGit2, History
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  onSync?: () => void;
  onExportExcel?: () => void;
  onOpenSettings?: () => void;
  onOpenConnectModal?: () => void;
  onOpenProfileModal?: () => void;
  isSyncing?: boolean;
  lastSynced?: Date | null;
}

export const Layout = ({
  children,
  activeView,
  setActiveView,
  onOpenSettings,
  onOpenProfileModal
}: LayoutProps) => {
  const { networkConfig, currentUser } = useAppContext();

  return (
    <div className="grid grid-cols-[80px_1fr] h-screen w-full overflow-hidden bg-bg-base text-ink font-sans">
      <aside className="bg-ink text-white flex flex-col items-center py-6 gap-8 relative z-20">
        <img src="/icon.png" className="w-9 h-9 bg-white rounded-[10px] p-1 mb-2" alt="Logo" />
        
        <button onClick={() => setActiveView('dashboard')} className={\`group relative opacity-50 hover:opacity-100 transition-opacity \${activeView === 'dashboard' ? 'opacity-100' : ''}\`}>
          {activeView === 'dashboard' && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>}
          <Activity className="w-5 h-5" />
          <div className="absolute left-12 top-1/2 -translate-y-1/2 px-2 py-1 bg-ink text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-md">Dashboard</div>
        </button>
        <button onClick={() => setActiveView('kanban')} className={\`group relative opacity-50 hover:opacity-100 transition-opacity \${activeView === 'kanban' ? 'opacity-100' : ''}\`}>
          {activeView === 'kanban' && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>}
          <LayoutDashboard className="w-5 h-5" />
          <div className="absolute left-12 top-1/2 -translate-y-1/2 px-2 py-1 bg-ink text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-md">Kanban Board</div>
        </button>
        <button onClick={() => setActiveView('table')} className={\`group relative opacity-50 hover:opacity-100 transition-opacity \${activeView === 'table' ? 'opacity-100' : ''}\`}>
          {activeView === 'table' && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>}
          <List className="w-5 h-5" />
          <div className="absolute left-12 top-1/2 -translate-y-1/2 px-2 py-1 bg-ink text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-md">Issues Registry</div>
        </button>
        <button onClick={() => setActiveView('projects')} className={\`group relative opacity-50 hover:opacity-100 transition-opacity \${activeView === 'projects' ? 'opacity-100' : ''}\`}>
          {activeView === 'projects' && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>}
          <FolderGit2 className="w-5 h-5" />
          <div className="absolute left-12 top-1/2 -translate-y-1/2 px-2 py-1 bg-ink text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-md">Projects</div>
        </button>
        <button onClick={() => setActiveView('activity')} className={\`group relative opacity-50 hover:opacity-100 transition-opacity \${activeView === 'activity' ? 'opacity-100' : ''}\`}>
          {activeView === 'activity' && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>}
          <History className="w-5 h-5" />
          <div className="absolute left-12 top-1/2 -translate-y-1/2 px-2 py-1 bg-ink text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-md">Activity Logs</div>
        </button>

        <div className="mt-auto flex flex-col gap-6 items-center">
          <button onClick={onOpenSettings} className="group relative opacity-50 hover:opacity-100 transition-opacity">
            <Settings className="w-5 h-5" />
            <div className="absolute left-12 top-1/2 -translate-y-1/2 px-2 py-1 bg-ink text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-md">Settings</div>
          </button>
          
          <button 
            onClick={onOpenProfileModal} 
            className="group relative w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-xs border border-ink hover:bg-white text-ink transition-colors"
          >
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            <div className="absolute left-12 top-1/2 -translate-y-1/2 px-2 py-1 bg-ink text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-md">My Profile</div>
          </button>
        </div>
      </aside>

      <main className="flex flex-col h-full overflow-y-auto py-6 px-10 gap-6">
        <header className="flex justify-between items-baseline shrink-0">
          <div>
            <h1 className="font-serif text-[2.5rem] font-semibold italic tracking-tight mb-1">Defect Diary</h1>
            <div className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] text-emerald-500 mt-1 uppercase">
              <div className="w-[5px] h-[5px] rounded-full bg-emerald-500"></div> System Online
            </div>
          </div>
          <div className="text-right font-mono text-[0.65rem] uppercase tracking-widest text-ink-muted flex flex-col items-end">
            Master Node / US-East-1<br />
            Workspace: {networkConfig?.orgCode || 'ORG-LOCAL'}
          </div>
        </header>

        <div className="flex flex-col gap-6 flex-1 min-h-0">
          {children}
        </div>

        <footer className="flex justify-between font-mono text-[0.6rem] text-ink-muted uppercase tracking-[0.15em] pt-4 shrink-0 border-t border-ink-faint">
          <div>Build 722 // v2.4.1</div>
          <div>Sync: Active [30s]</div>
          <div>2024 © Engineering Studio</div>
        </footer>
      </main>
    </div>
  );
};
`
fs.writeFileSync('src/components/Layout.tsx', updatedLayout);
