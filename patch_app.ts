import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// we'll find the <Layout ... > ... </Layout> section and replace it.

const newAppContent = `  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView} 
      onSync={() => {}}
      onExportExcel={() => exportToExcel(defects, auditTrail)}
      onOpenSettings={() => setIsSettingsOpen(true)}
      onOpenConnectModal={() => setIsConnectModalOpen(true)}
      onOpenProfileModal={() => setIsProfileOpen(true)}
      isSyncing={false}
      lastSynced={new Date()}
    >
      <div className="flex justify-between items-center shrink-0">
        <input 
          type="text" 
          className="bg-ink-faint border-none px-6 py-4 rounded-full font-sans w-[400px] text-[0.9rem] outline-none" 
          placeholder="Search across all platforms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-3">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleImportCSV} 
            className="hidden" 
          />
          <select 
            value={filterProject} 
            onChange={e => setFilterProject(e.target.value)} 
            className="px-6 py-3 rounded-full border border-ink bg-transparent font-medium text-sm cursor-pointer hover:bg-black/5 outline-none appearance-none"
          >
            <option value="All">Projects (All)</option>
            {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)} 
            className="px-6 py-3 rounded-full border border-ink bg-transparent font-medium text-sm cursor-pointer hover:bg-black/5 outline-none appearance-none"
          >
            <option value="All">Status (All)</option>
            {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button 
            onClick={() => {
              if (projects.length === 0) {
                alert("There are no Projects. Please add a project to continue.");
                setActiveView('projects');
              } else {
                fileInputRef.current?.click();
              }
            }} 
            className="px-6 py-3 rounded-full border border-ink bg-transparent font-medium text-sm cursor-pointer hover:bg-black/5"
          >
            Import
          </button>
          <button 
            onClick={() => {
              if (projects.length === 0) {
                alert("There are no Projects. Please add a project to continue.");
                setActiveView('projects');
              } else {
                setSelectedDefect(undefined); 
                setIsFormOpen(true);
              }
            }} 
            className="px-6 py-3 rounded-full border border-ink bg-ink text-white font-medium text-sm cursor-pointer hover:opacity-90"
          >
            New Defect
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto min-h-0 relative bg-white border border-ink-faint rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col">
        {renderView()}
      </div>

      {isFormOpen && (
        <DefectFormModal 
          existingDefect={selectedDefect} 
          onClose={() => { setIsFormOpen(false); setSelectedDefect(undefined); }} 
        />
      )}
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
      
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md">
            {networkConfig && socket && (
              <button 
                onClick={() => setIsConnectModalOpen(false)}
                className="absolute -top-4 -right-4 w-8 h-8 bg-white text-slate-500 hover:text-slate-900 rounded-full shadow-lg flex items-center justify-center transition-colors z-10"
              >
                &times;
              </button>
            )}
            <NetworkConnect />
          </div>
        </div>
      )}
      <Chatbot />
    </Layout>
  );`;

const startIndex = content.indexOf('  return (\n    <Layout ');
const endIndex = content.lastIndexOf('</Layout>');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newAppContent + content.substring(endIndex + 9);
} else {
  console.log("Could not find Layout in App.tsx");
}

fs.writeFileSync('src/App.tsx', content);
