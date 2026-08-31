import React, { useState } from 'react';
import { LayoutDashboard, Columns, Table as TableIcon, FileSpreadsheet, Settings, LogOut, Search, Filter, Link2, Unlink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Status } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  onSync: () => void;
  onExportExcel: () => void;
  onOpenSettings: () => void;
  onOpenConnectModal?: () => void;
  isSyncing?: boolean;
  lastSynced?: Date | null;
}

export const Layout = ({ children, activeView, setActiveView, onSync, onExportExcel, onOpenSettings, onOpenConnectModal, isSyncing, lastSynced }: LayoutProps) => {
  const { currentUser, isAuthenticated, setIsAuthenticated, spreadsheetId, setSpreadsheetId, spreadsheetTitle, setSpreadsheetTitle, projects, searchQuery, setSearchQuery, filterProject, setFilterProject, filterStatus, setFilterStatus } = useAppContext();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'table', label: 'Issues Registry', icon: TableIcon },
    { id: 'kanban', label: 'Kanban Board', icon: Columns },
    { id: 'activity', label: 'Activity Logs', icon: FileSpreadsheet },
  ];

  return (
    <div className="flex flex-col min-h-screen h-screen bg-[#F1F5F9] text-slate-900 font-sans antialiased overflow-hidden">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Defect <span className="text-xs font-normal bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded ml-2 uppercase tracking-wider">Diary</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          {spreadsheetId ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Connected</span>
                <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">{spreadsheetTitle || 'Google Sheet'}</span>
              </div>
              <button 
                onClick={() => {
                  setSpreadsheetId(null);
                  setSpreadsheetTitle(null);
                  setIsAuthenticated(false);
                }}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Disconnect"
              >
                <Unlink className="w-4 h-4" />
              </button>
              <a 
                href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
                target="_blank"
                rel="noreferrer"
                title="Open Google Sheet in new tab"
                className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full hover:bg-green-100 transition-colors cursor-pointer shadow-sm ml-2"
              >
                <div className={`w-2 h-2 bg-green-500 rounded-full ${isSyncing ? 'animate-pulse' : ''}`}></div>
                <span className="text-xs font-medium text-green-700">
                  {isSyncing ? 'Syncing...' : 'Open'}
                </span>
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Not Connected</span>
              <button
                onClick={onOpenConnectModal}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer shadow-sm"
              >
                <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-medium text-indigo-700">Connect Sheet</span>
              </button>
            </div>
          )}
          
          {lastSynced && spreadsheetId && (
            <span className="text-xs text-slate-500 hidden sm:inline-block border-l pl-6 border-slate-200">
              Last synced: {lastSynced.toLocaleTimeString()}
            </span>
          )}

          {currentUser && (
            <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                {currentUser?.name.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-slate-900 flex flex-col shrink-0">
          <nav className="flex-1 p-4 space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Workspace</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    isActive 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              )
            })}
            
            <div className="pt-8 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Integrations</div>
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            >
              <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-[10px] text-white font-bold shrink-0">GS</div>
              <span className="font-medium text-sm text-left">{isSyncing ? 'Syncing Now...' : 'Force Sync Sheet'}</span>
            </button>
            <button
              onClick={onOpenSettings}
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors mt-2"
            >
              <div className="w-5 h-5 bg-slate-700 rounded flex items-center justify-center text-slate-300 shrink-0">
                <Settings className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-sm text-left">App Settings</span>
            </button>
          </nav>
          
          <div className="p-4 bg-slate-800/50 mt-auto">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Storage Utilization</div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mb-1 overflow-hidden">
              <div className="w-2/3 h-1.5 bg-indigo-500 rounded-full"></div>
            </div>
            <div className="text-[10px] text-slate-400">4.2MB of 15MB Shared Space</div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">
          {isAuthenticated && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center shrink-0">
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search defects by title, ID, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center text-sm font-medium text-slate-500 gap-2">
                  <Filter className="w-4 h-4" /> Filters:
                </div>
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="All">All Projects</option>
                  {projects.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="All">All Statuses</option>
                  {Object.values(Status).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {children}
          
          <footer className="h-8 bg-slate-50 border-t border-slate-200 flex items-center px-6 justify-between shrink-0 text-[10px] text-slate-400 font-medium uppercase tracking-widest -mx-6 -mb-6 mt-6">
            <div>Auto-Sync: ENABLED • Refresh Interval: 30s</div>
            <div>Current Version: v2.4.1 Build-722</div>
            <div>Server Location: US-East-1 • API Stable</div>
          </footer>
        </main>
      </div>
    </div>
  );
};
