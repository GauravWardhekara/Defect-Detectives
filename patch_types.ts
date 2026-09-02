import fs from 'fs';

let content = fs.readFileSync('src/types.ts', 'utf-8');
content = content.replace('projects: string[];', 'projects: Project[];');
content += `\nexport interface Project {\n  id: string;\n  name: string;\n}\n`;
fs.writeFileSync('src/types.ts', content);
