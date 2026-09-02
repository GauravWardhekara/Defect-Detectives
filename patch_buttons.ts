import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace New Defect logic
const newDefectLogic = `               if (projects.length === 0) {
                const newProj = window.prompt("Please add a project before creating a defect:");
                if (newProj && newProj.trim()) {
                  addProject(newProj.trim());
                  if (socket) socket.emit('add_project', newProj.trim());
                  setSelectedDefect(undefined); 
                  setIsFormOpen(true);
                }
              } else {
                setSelectedDefect(undefined); 
                setIsFormOpen(true);
              }`;

const replacedNewDefectLogic = `              if (projects.length === 0) {
                alert("There are no Projects. Please add a project to continue.");
                setActiveView('projects');
              } else {
                setSelectedDefect(undefined); 
                setIsFormOpen(true);
              }`;

content = content.replace(newDefectLogic, replacedNewDefectLogic);

// Replace button sizes
content = content.replace(/className="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-sm/g, 'className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs');
content = content.replace(/className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm/g, 'className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs');
content = content.replace(/className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm/g, 'className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs');

fs.writeFileSync('src/App.tsx', content);
