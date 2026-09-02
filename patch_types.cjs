const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('export interface Platform')) {
  code = code.replace(
    'export interface Project {',
    `export interface Platform {
  id: string;
  name: string;
}

export interface Project {`
  );
}

if (!code.includes('platforms: Platform[]')) {
  code = code.replace(
    'projects: Project[];',
    'projects: Project[];\n  platforms: Platform[];'
  );
}

if (!code.includes('platforms?: string[]')) {
  code = code.replace(
    'project: string;',
    'project: string;\n  platforms?: string[];'
  );
}

fs.writeFileSync('src/types.ts', code);
