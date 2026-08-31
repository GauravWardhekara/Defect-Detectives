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
  onOpenProfileModal?: () => void;
  isSyncing?: boolean;
  lastSynced?: Date | null;
}

export const Layout = ({ children, activeView, setActiveView, onSync, onExportExcel, onOpenSettings, onOpenConnectModal, onOpenProfileModal, isSyncing, lastSynced }: LayoutProps) => {
  const { currentUser, authStatus, networkConfig, socket, projects, searchQuery, setSearchQuery, filterProject, setFilterProject, filterStatus, setFilterStatus } = useAppContext();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const isWorkspaceActive = networkConfig?.isMaster || authStatus === 'success';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'table', label: 'Issues Registry', icon: TableIcon },
    { id: 'kanban', label: 'Kanban Board', icon: Columns },
    { id: 'activity', label: 'Activity Logs', icon: FileSpreadsheet },
  ];

  return (
    <div className="flex flex-col min-h-screen h-screen bg-[#F1F5F9] text-slate-900 font-sans antialiased overflow-hidden">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 flex items-center">
            Defect <span className="hidden sm:inline-block text-xs font-normal bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded ml-2 uppercase tracking-wider">Diary</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-6">
          {networkConfig ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                  {networkConfig.isMaster ? 'Master Node' : 'Connected'}
                </span>
                <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">
                  Workspace: {networkConfig.orgCode || 'LAN'}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full shadow-sm sm:ml-2">
                <div className={`w-2 h-2 rounded-full ${socket?.connected ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
                <span className="hidden sm:inline-block text-xs font-medium text-green-700">
                  {socket?.connected ? 'Online' : 'Reconnecting...'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Disconnected</span>
              <button
                onClick={onOpenConnectModal}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer shadow-sm"
              >
                <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-medium text-indigo-700 hidden sm:inline-block">Scan LAN</span>
              </button>
            </div>
          )}

          {currentUser && (
            <div className="flex items-center gap-4 sm:border-l sm:pl-6 border-slate-200">
              <button 
                onClick={onOpenProfileModal}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                title="My Profile"
              >
                {currentUser?.name.charAt(0).toUpperCase()}
              </button>
            </div>
          )}
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar (Hidden in portrait) */}
        <aside className="w-64 bg-slate-900 shrink-0 hidden portrait:hidden landscape:flex flex-col">
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
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Workspace Analytics</div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mb-1 overflow-hidden">
              <div className="w-2/3 h-1.5 bg-indigo-500 rounded-full"></div>
            </div>
            <div className="text-[10px] text-slate-400">Local encryption active</div>
          </div>
        </aside>

        {/* Bottom Navigation for Portrait */}
        <nav className="portrait:flex hidden landscape:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-lg transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className={`p-1.5 rounded-full ${isActive ? 'bg-indigo-50' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
          <button
            onClick={onOpenSettings}
            className="flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-lg transition-colors text-slate-500 hover:text-slate-700"
          >
            <div className="p-1.5 rounded-full">
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Settings</span>
          </button>
        </nav>

        <main className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto portrait:pb-24 overflow-x-hidden">
          {isWorkspaceActive && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col shrink-0">
              <div className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative w-full md:flex-1 md:min-w-[200px]">
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
                
                {/* Mobile Filter Toggle */}
                <button 
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="md:hidden flex items-center justify-between w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600"
                >
                  <div className="flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</div>
                  <span className="text-xs text-indigo-600">{filterProject !== 'All' || filterStatus !== 'All' ? 'Active' : ''}</span>
                </button>

                {/* Desktop Filters / Expanded Mobile Filters */}
                <div className={`flex-col md:flex-row flex-wrap items-center gap-3 w-full md:w-auto md:flex ${isFiltersOpen ? 'flex' : 'hidden'}`}>
                  <div className="hidden md:flex items-center text-sm font-medium text-slate-500 gap-2 shrink-0">
                    <Filter className="w-4 h-4" /> Filters:
                  </div>
                  <select
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                    className="w-full md:w-auto text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white min-w-[120px]"
                  >
                    <option value="All">All Projects</option>
                    {projects.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full md:w-auto text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white min-w-[120px]"
                  >
                    <option value="All">All Statuses</option>
                    {Object.values(Status).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-x-auto min-h-0 relative">
            {children}
          </div>
          
          <footer className="hidden md:flex h-8 bg-slate-50 border-t border-slate-200 items-center px-6 justify-between shrink-0 text-[10px] text-slate-400 font-medium uppercase tracking-widest -mx-6 -mb-6 mt-6">
            <div>Auto-Sync: ENABLED • Refresh Interval: 30s</div>
            <div>Current Version: v2.4.1 Build-722</div>
            <div>Server Location: US-East-1 • API Stable</div>
          </footer>
        </main>
      </div>
    </div>
  );
};
