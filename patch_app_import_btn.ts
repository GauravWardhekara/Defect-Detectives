import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>`;

const replacement = `          <button
            onClick={() => {
              if (projects.length === 0) {
                const newProj = window.prompt("Please add a project before importing defects:");
                if (newProj && newProj.trim()) {
                  addProject(newProj.trim());
                  if (socket) socket.emit('add_project', newProj.trim());
                  // small timeout to ensure state update if needed before click
                  setTimeout(() => fileInputRef.current?.click(), 100);
                }
              } else {
                fileInputRef.current?.click();
              }
            }}
            className="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
