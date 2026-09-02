import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Import ProjectConfigurationsView
content = content.replace("import { ActivityLogsView } from './components/ActivityLogsView';", "import { ActivityLogsView } from './components/ActivityLogsView';\nimport { ProjectConfigurationsView } from './components/ProjectConfigurationsView';");

// Add 'projects' to activeView switch
content = content.replace(`      case 'activity': return <ActivityLogsView />;`, `      case 'activity': return <ActivityLogsView />;\n      case 'projects': return <ProjectConfigurationsView />;`);

// Add 'projects' title to h2
content = content.replace(`{activeView === 'kanban' ? 'Kanban Board' : activeView === 'table' ? 'Issues Registry' : activeView === 'activity' ? 'Activity Logs' : 'Project Health Overview'}`, `{activeView === 'projects' ? 'Project Configurations' : activeView === 'kanban' ? 'Kanban Board' : activeView === 'table' ? 'Issues Registry' : activeView === 'activity' ? 'Activity Logs' : 'Project Health Overview'}`);

// Update import CSV logic
content = content.replace(`              if (projects.length === 0) {
                const newProj = window.prompt("Please add a project before importing defects:");
                if (newProj && newProj.trim()) {
                  addProject(newProj.trim());
                  if (socket) socket.emit('add_project', newProj.trim());
                  // small timeout to ensure state update if needed before click
                  setTimeout(() => fileInputRef.current?.click(), 100);
                }
              } else {
                fileInputRef.current?.click();
              }`, `              if (projects.length === 0) {
                alert("There are no Projects. Please add a project to continue.");
                setActiveView('projects');
              } else {
                fileInputRef.current?.click();
              }`);

// Update export Excel logic
content = content.replace(`onClick={() => exportToExcel(defects, auditTrail)}`, `onClick={() => {
              if (projects.length === 0) {
                alert("There are no Projects. Please add a project to continue.");
                setActiveView('projects');
              } else {
                exportToExcel(defects, auditTrail);
              }
            }}`);

// Update new defect logic
content = content.replace(`               if (projects.length === 0) {
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
              }`, `               if (projects.length === 0) {
                alert("There are no Projects. Please add a project to continue.");
                setActiveView('projects');
              } else {
                setSelectedDefect(undefined); 
                setIsFormOpen(true);
              }`);

// Also fix rowProj check in App.tsx (for import)
// `projects.includes(rowProj)` -> `projects.find(p => p.name === rowProj)`
content = content.replace(`if (rowProj && !projects.includes(rowProj)) {`, `if (rowProj && !projects.find(p => p.name === rowProj)) {`);

fs.writeFileSync('src/App.tsx', content);
