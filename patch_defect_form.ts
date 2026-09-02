import fs from 'fs';
let content = fs.readFileSync('src/components/DefectFormModal.tsx', 'utf-8');

// Replace map
content = content.replace(`{projects.map(p => <option key={p} value={p}>{p}</option>)}`, `{projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}`);

// Replace projects.includes
content = content.replace(`if (newProj && newProj.trim() && !projects.includes(newProj.trim())) {`, `if (newProj && newProj.trim() && !projects.find(p => p.name === newProj.trim())) {`);

// Replace default project logic
content = content.replace(`project: filterProject !== 'All' ? filterProject : projects[0],`, `project: filterProject !== 'All' ? filterProject : (projects[0]?.name || ''),`);
content = content.replace(`project: filterProject !== 'All' ? filterProject : (projects.length > 0 ? projects[0] : 'General'),`, `project: filterProject !== 'All' ? filterProject : (projects.length > 0 ? projects[0].name : 'General'),`);

fs.writeFileSync('src/components/DefectFormModal.tsx', content);
