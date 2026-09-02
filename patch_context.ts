import fs from 'fs';

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const targetIf = `  addProject: (project: string) => void;`;
const replacementIf = `  addProject: (project: string) => void;
  deleteProject: (project: string) => void;`;

content = content.replace(targetIf, replacementIf);

const targetFn = `  const addProject = (project: string) => setProjects(prev => [...prev, project]);`;
const replacementFn = `  const addProject = (project: string) => setProjects(prev => [...prev, project]);
  const deleteProject = (project: string) => {
    setProjects(prev => prev.filter(p => p !== project));
    if (filterProject === project) {
      setFilterProject('All');
    }
    if (socketRef.current) {
      socketRef.current.emit('delete_project', project);
    }
  };`;

content = content.replace(targetFn, replacementFn);

const targetExport = `    addProject,`;
const replacementExport = `    addProject,
    deleteProject,`;
    
content = content.replace(targetExport, replacementExport);

fs.writeFileSync('src/context/AppContext.tsx', content);
