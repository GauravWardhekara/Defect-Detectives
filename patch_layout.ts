import fs from 'fs';

let content = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

const targetImport = `import { LayoutDashboard, Columns, Table as TableIcon, FileSpreadsheet, Settings, LogOut, Search, Filter, Link2, Unlink } from 'lucide-react';`;
const replaceImport = `import { LayoutDashboard, Columns, Table as TableIcon, FileSpreadsheet, Settings, LogOut, Search, Filter, Link2, Unlink, Trash2 } from 'lucide-react';`;
content = content.replace(targetImport, replaceImport);

const targetCtx = `const { currentUser, authStatus, networkConfig, socket, projects, searchQuery, setSearchQuery, filterProject, setFilterProject, filterStatus, setFilterStatus } = useAppContext();`;
const replaceCtx = `const { currentUser, authStatus, networkConfig, socket, projects, searchQuery, setSearchQuery, filterProject, setFilterProject, filterStatus, setFilterStatus, deleteProject } = useAppContext();`;
content = content.replace(targetCtx, replaceCtx);

const targetMap = `                  {projects.map((project) => (
                    <button
                      key={project}
                      onClick={() => setFilterProject(project)}
                      className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors \${
                        filterProject === project
                          ? 'bg-slate-800 text-white' 
                          : 'text-slate-400 hover:bg-slate-800'
                      }\`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        <div className={\`w-2 h-2 rounded-full \${filterProject === project ? 'bg-indigo-400' : 'bg-slate-600'}\`}></div>
                      </div>
                      <span className="truncate text-left">{project}</span>
                    </button>
                  ))}`;
                  
const replaceMap = `                  {projects.map((project) => (
                    <div key={project} className="group relative w-full flex items-center">
                      <button
                        onClick={() => setFilterProject(project)}
                        className={\`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors \${
                          filterProject === project
                            ? 'bg-slate-800 text-white' 
                            : 'text-slate-400 hover:bg-slate-800'
                        }\`}
                      >
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          <div className={\`w-2 h-2 rounded-full \${filterProject === project ? 'bg-indigo-400' : 'bg-slate-600'}\`}></div>
                        </div>
                        <span className="truncate text-left">{project}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(\`Are you sure you want to delete the project "\${project}"? This will permanently delete all associated defects.\`)) {
                            deleteProject(project);
                          }
                        }}
                        className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-md transition-all"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}`;

content = content.replace(targetMap, replaceMap);

fs.writeFileSync('src/components/Layout.tsx', content);
