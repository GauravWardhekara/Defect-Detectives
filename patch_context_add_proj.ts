import fs from 'fs';

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const target = `  const addProject = (project: string) => setProjects(prev => [...prev, project]);`;
const replacement = `  const addProject = (project: string) => setProjects(prev => prev.includes(project) ? prev : [...prev, project]);`;

content = content.replace(target, replacement);
fs.writeFileSync('src/context/AppContext.tsx', content);
