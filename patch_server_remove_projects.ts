import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const target = `  if (!serverConfig.projects) {
    serverConfig.projects = ['E-Commerce Web Portal', 'Mobile iOS & Android', 'Payment Gateway', 'Inventory ERP', 'Customer Support Dashboard', 'Analytics Pipeline', 'Marketing Site'];
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(serverConfig, null, 2));
  } else {
    serverConfig.projects = Array.from(new Set(serverConfig.projects));
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(serverConfig, null, 2));
  }`;

const replace = `  if (!serverConfig.projects) {
    serverConfig.projects = [];
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(serverConfig, null, 2));
  } else {
    serverConfig.projects = Array.from(new Set(serverConfig.projects));
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(serverConfig, null, 2));
  }`;

content = content.replace(target, replace);
fs.writeFileSync('server.ts', content);

let contextContent = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');
const ctxTarget = `projects: ['E-Commerce Web Portal', 'Mobile iOS & Android', 'Payment Gateway', 'Inventory ERP', 'Customer Support Dashboard', 'Analytics Pipeline', 'Marketing Site'],`;
const ctxReplace = `projects: [],`;
contextContent = contextContent.replace(ctxTarget, ctxReplace);
fs.writeFileSync('src/context/AppContext.tsx', contextContent);
