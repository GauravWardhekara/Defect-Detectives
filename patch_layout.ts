import fs from 'fs';
let content = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

// 1. In the sidebar menu, add "Projects"
const sidebarNav = `          <nav className="p-4 space-y-1">
            <button onClick={() => setActiveView('dashboard')} className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors \${activeView === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}\`}>
              <Activity className="w-5 h-5" /> Dashboard
            </button>
            <button onClick={() => setActiveView('kanban')} className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors \${activeView === 'kanban' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}\`}>
              <LayoutDashboard className="w-5 h-5" /> Kanban Board
            </button>
            <button onClick={() => setActiveView('table')} className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors \${activeView === 'table' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}\`}>
              <List className="w-5 h-5" /> Issues Registry
            </button>
            <button onClick={() => setActiveView('activity')} className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors \${activeView === 'activity' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}\`}>
              <History className="w-5 h-5" /> Activity Logs
            </button>`;
const updatedSidebarNav = `          <nav className="p-4 space-y-1">
            <button onClick={() => setActiveView('dashboard')} className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors \${activeView === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}\`}>
              <Activity className="w-5 h-5" /> Dashboard
            </button>
            <button onClick={() => setActiveView('kanban')} className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors \${activeView === 'kanban' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}\`}>
              <LayoutDashboard className="w-5 h-5" /> Kanban Board
            </button>
            <button onClick={() => setActiveView('table')} className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors \${activeView === 'table' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}\`}>
              <List className="w-5 h-5" /> Issues Registry
            </button>
            <button onClick={() => setActiveView('activity')} className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors \${activeView === 'activity' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}\`}>
              <History className="w-5 h-5" /> Activity Logs
            </button>
            <button onClick={() => setActiveView('projects')} className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors \${activeView === 'projects' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}\`}>
              <FolderGit2 className="w-5 h-5" /> Projects
            </button>`;
content = content.replace(sidebarNav, updatedSidebarNav);

// 2. Fix the projects map for filter sidebar
// original code:
// {projects.map((project) => (
//   <button key={project} onClick={() => setFilterProject(project)} ...>
//      <FolderGit2 ... /> {project}
//   </button>
// ))}
content = content.replace(`{projects.map((project) => (
                    <button
                      key={project}
                      onClick={() => setFilterProject(project)}
                      className={\`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors \${
                        filterProject === project
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }\`}
                    >
                      <div className="flex items-center gap-3">
                        <FolderGit2 className="w-4 h-4" />
                        {project}
                      </div>
                    </button>
                  ))}`, `{projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setFilterProject(project.name)}
                      className={\`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors \${
                        filterProject === project.name
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }\`}
                    >
                      <div className="flex items-center gap-3 truncate pr-2">
                        <FolderGit2 className="w-4 h-4 shrink-0" />
                        <span className="truncate">{project.name}</span>
                      </div>
                    </button>
                  ))}`);

// 3. Fix the projects map for header dropdown (mobile)
content = content.replace(`{projects.map(p => (
                      <button
                        key={p}
                        onClick={() => { setFilterProject(p); setIsMobileMenuOpen(false); }}
                        className={\`w-full text-left px-3 py-2 rounded-lg text-sm \${filterProject === p ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600'}\`}
                      >
                        {p}
                      </button>
                    ))}`, `{projects.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setFilterProject(p.name); setIsMobileMenuOpen(false); }}
                        className={\`w-full text-left px-3 py-2 rounded-lg text-sm truncate \${filterProject === p.name ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600'}\`}
                      >
                        {p.name}
                      </button>
                    ))}`);

fs.writeFileSync('src/components/Layout.tsx', content);
