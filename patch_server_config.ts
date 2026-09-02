import fs from 'fs';
import path from 'path';
import os from 'os';

let content = fs.readFileSync('server.ts', 'utf-8');

const target = `projects: ['E-Commerce Web Portal', 'Mobile iOS & Android', 'Payment Gateway', 'Inventory ERP', 'Customer Support Dashboard', 'Analytics Pipeline', 'Marketing Site']`;
const replacement = `projects: []`;

content = content.replace(target, replacement);
fs.writeFileSync('server.ts', content);

const configPath = path.join(os.homedir(), '.defect-diary', 'server-config.json');
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const defaultProj = ['E-Commerce Web Portal', 'Mobile iOS & Android', 'Payment Gateway', 'Inventory ERP', 'Customer Support Dashboard', 'Analytics Pipeline', 'Marketing Site'];
  const currentProjStr = JSON.stringify(config.projects);
  const defaultProjStr = JSON.stringify(defaultProj);
  if (currentProjStr === defaultProjStr || !config.projects) {
     config.projects = [];
     fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
}
