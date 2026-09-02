const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

if (!code.includes('addPlatform')) {
  // Add to AppContextType
  code = code.replace(
    'addProject: (name: string) => void;',
    'addProject: (name: string) => void;\n  addPlatform: (name: string) => void;'
  );
  
  // Add to defaultState
  code = code.replace(
    'projects: [],',
    'projects: [],\n  platforms: [],'
  );
  
  // Add useState
  code = code.replace(
    'const [projects, setProjects] = useState<Project[]>(defaultState.projects);',
    'const [projects, setProjects] = useState<Project[]>(defaultState.projects);\n  const [platforms, setPlatforms] = useState<Platform[]>(defaultState.platforms);'
  );
  
  // Add socket payload types
  code = code.replace(
    /projects\?: Project\[\]/g,
    'projects?: Project[], platforms?: Platform[]'
  );
  
  // Add socket sets
  code = code.replace(
    /if \(res\.projects\) setProjects\(res\.projects\);/g,
    'if (res.projects) setProjects(res.projects);\n            if (res.platforms) setPlatforms(res.platforms);'
  );
  
  // Add socket listener
  const projectListener = `s.on("projects_updated", (projs: Project[]) => {
            setProjects(projs);
          });`;
  const platformListener = `s.on("platforms_updated", (plats: Platform[]) => {
            setPlatforms(plats);
          });`;
  code = code.split(projectListener).join(projectListener + '\n          ' + platformListener);

  const projectListener2 = `s.on("projects_updated", (projs: Project[]) => {
        setProjects(projs);
      });`;
  const platformListener2 = `s.on("platforms_updated", (plats: Platform[]) => {
        setPlatforms(plats);
      });`;
  code = code.split(projectListener2).join(projectListener2 + '\n      ' + platformListener2);
  
  // Add addPlatform method
  code = code.replace(
    'const addProject = (name: string) => setProjects(prev => prev.find(p => p.name === name) ? prev : [...prev, { id: \'local-\' + Date.now(), name }]);',
    'const addProject = (name: string) => setProjects(prev => prev.find(p => p.name === name) ? prev : [...prev, { id: \'local-\' + Date.now(), name }]);\n  const addPlatform = (name: string) => setPlatforms(prev => prev.find(p => p.name === name) ? prev : [...prev, { id: \'local-\' + Date.now(), name }]);'
  );
  
  // Add to return object
  code = code.replace(
    'projects, addProject, deleteProject,',
    'projects, addProject, deleteProject,\n    platforms, addPlatform,'
  );
  
  fs.writeFileSync('src/context/AppContext.tsx', code);
}
