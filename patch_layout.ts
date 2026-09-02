import fs from 'fs';
let content = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

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
      <aside className="bg-ink text-white flex flex-col items-center py-8 gap-10">
        <img src="/icon.png" className="w-10 h-10 bg-white rounded-xl p-1" alt="Logo" />
        
        <button onClick={() => setActiveView('dashboard')} className={\`relative opacity-50 hover:opacity-100 transition-opacity \${activeView === 'dashboard' ? 'opacity-100' : ''}\`}>
          {activeView === 'dashboard' && <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>}
          <Activity className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveView('kanban')} className={\`relative opacity-50 hover:opacity-100 transition-opacity \${activeView === 'kanban' ? 'opacity-100' : ''}\`}>
          {activeView === 'kanban' && <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>}
          <LayoutDashboard className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveView('table')} className={\`relative opacity-50 hover:opacity-100 transition-opacity \${activeView === 'table' ? 'opacity-100' : ''}\`}>
          {activeView === 'table' && <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>}
          <List className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveView('projects')} className={\`relative opacity-50 hover:opacity-100 transition-opacity \${activeView === 'projects' ? 'opacity-100' : ''}\`}>
          {activeView === 'projects' && <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>}
          <FolderGit2 className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveView('activity')} className={\`relative opacity-50 hover:opacity-100 transition-opacity \${activeView === 'activity' ? 'opacity-100' : ''}\`}>
          {activeView === 'activity' && <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>}
          <History className="w-6 h-6" />
        </button>

        <button onClick={onOpenSettings} className="mt-auto relative opacity-50 hover:opacity-100 transition-opacity">
          <Settings className="w-6 h-6" />
        </button>
      </aside>

      <main className="grid grid-rows-[auto_1fr_auto] overflow-hidden py-10 px-16 gap-8">
        <header className="flex justify-between items-baseline">
          <div>
            <h1 className="font-serif text-[3rem] font-semibold italic tracking-tight mb-1">Defect Diary</h1>
            <div className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] text-emerald-500 mt-1 uppercase">
              <div className="w-[5px] h-[5px] rounded-full bg-emerald-500"></div> System Online
            </div>
          </div>
          <div className="text-right font-mono text-[0.65rem] uppercase tracking-widest text-ink-muted flex flex-col items-end">
            Master Node / US-East-1<br />
            Workspace: {networkConfig?.orgCode || 'ORG-LOCAL'}
            <div className="mt-4 flex justify-end">
              <button onClick={onOpenProfileModal} className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-sm border border-ink-faint hover:bg-slate-300">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 min-h-0 overflow-hidden">
          {children}
        </div>

        <footer className="flex justify-between font-mono text-[0.6rem] text-ink-muted uppercase tracking-[0.15em] pt-4">
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
