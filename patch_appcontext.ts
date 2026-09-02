import fs from 'fs';
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

// replace the state type
content = content.replace(`projects: string[];`, `projects: Project[];`);
content = content.replace(`projects?: string[]`, `projects?: Project[]`); // in the auth_success and projects_updated handlers
content = content.replace(`projects?: string[]`, `projects?: Project[]`);
content = content.replace(`projects?: string[]`, `projects?: Project[]`);
content = content.replace(`projects?: string[]`, `projects?: Project[]`);
content = content.replace(`projects_updated", (projs: string[])`, `projects_updated", (projs: Project[])`);
content = content.replace(`projects_updated", (projs: string[])`, `projects_updated", (projs: Project[])`);
content = content.replace(`projects_updated", (projs: string[])`, `projects_updated", (projs: Project[])`);
content = content.replace(`const [projects, setProjects] = useState<string[]>(defaultState.projects);`, `const [projects, setProjects] = useState<Project[]>(defaultState.projects);`);

// addProject and deleteProject
content = content.replace(`const addProject = (project: string) => setProjects(prev => prev.includes(project) ? prev : [...prev, project]);`, `const addProject = (name: string) => setProjects(prev => prev.find(p => p.name === name) ? prev : [...prev, { id: 'local-' + Date.now(), name }]);`);

content = content.replace(`  const deleteProject = (project: string) => {
    setProjects(prev => prev.filter(p => p !== project));
    if (filterProject === project) {
      setFilterProject('All');
    }
    if (socket) {
      socket.emit('delete_project', project);
    }
  };`, `  const deleteProject = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (filterProject === proj.name) {
      setFilterProject('All');
    }
    if (socket) {
      socket.emit('delete_project', projectId);
    }
  };`);

fs.writeFileSync('src/context/AppContext.tsx', content);
