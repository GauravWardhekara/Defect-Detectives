import fs from 'fs';
let content = fs.readFileSync('src/components/TableView.tsx', 'utf-8');

content = content.replace(`{projects.map(p => <option key={p} value={p}>{p}</option>)}`, `{projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}`);

fs.writeFileSync('src/components/TableView.tsx', content);
