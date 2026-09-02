import fs from 'fs';
import path from 'path';

let content = fs.readFileSync('server.ts', 'utf-8');

const target = `const basePath = process.env.USER_DATA_PATH || process.cwd();`;
const replacement = `const basePath = process.env.USER_DATA_PATH || require('path').join(require('os').homedir(), '.defect-diary');
if (!require('fs').existsSync(basePath)) {
  require('fs').mkdirSync(basePath, { recursive: true });
}`;

content = content.replace(target, replacement);

fs.writeFileSync('server.ts', content);
