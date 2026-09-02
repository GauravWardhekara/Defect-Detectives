import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

let content = fs.readFileSync('server.ts', 'utf-8');

// 1. Update interface
content = content.replace('projects?: string[];', 'projects?: { id: string; name: string }[];');

// 2. Migration code
const initCode = `  if (!serverConfig.projects) {
    serverConfig.projects = [];
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(serverConfig, null, 2));
  } else {
    serverConfig.projects = Array.from(new Set(serverConfig.projects));
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(serverConfig, null, 2));
  }`;
const newInitCode = `  if (!serverConfig.projects) {
    serverConfig.projects = [];
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(serverConfig, null, 2));
  } else {
    let migrated = false;
    serverConfig.projects = serverConfig.projects.map((p: any) => {
      if (typeof p === 'string') {
        migrated = true;
        return { id: require('crypto').randomBytes(4).toString("hex"), name: p };
      }
      return p;
    });
    // Remove duplicates by name
    const seen = new Set();
    serverConfig.projects = serverConfig.projects.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(serverConfig, null, 2));
  }`;
content = content.replace(initCode, newInitCode);

// 3. Update add_project, delete_project, update_project
content = content.replace(`      socket.on("add_project", (projectName: string) => {
        if (!serverConfig.projects) serverConfig.projects = [];
        if (!serverConfig.projects.includes(projectName)) {
          serverConfig.projects.push(projectName);
          saveConfig();
          io.to(serverConfig.orgCode).emit("projects_updated", serverConfig.projects);
        }
      });`, `      socket.on("add_project", (projectName: string) => {
        if (!serverConfig.projects) serverConfig.projects = [];
        if (!serverConfig.projects.find(p => p.name === projectName)) {
          serverConfig.projects.push({ id: require('crypto').randomBytes(4).toString("hex"), name: projectName });
          saveConfig();
          io.to(serverConfig.orgCode).emit("projects_updated", serverConfig.projects);
        }
      });`);

content = content.replace(`      socket.on("delete_project", (projectName: string) => {
        if (!serverConfig.projects) return;
        const idx = serverConfig.projects.indexOf(projectName);
        if (idx !== -1) {
          serverConfig.projects.splice(idx, 1);`, `      socket.on("delete_project", (projectId: string) => {
        if (!serverConfig.projects) return;
        const idx = serverConfig.projects.findIndex(p => p.id === projectId);
        if (idx !== -1) {
          serverConfig.projects.splice(idx, 1);`);

content = content.replace(`      socket.on("update_project", ({ oldName, newName }: { oldName: string, newName: string }) => {
        if (!serverConfig.projects) serverConfig.projects = [];
        const idx = serverConfig.projects.indexOf(oldName);
        if (idx !== -1 && newName && !serverConfig.projects.includes(newName)) {
          serverConfig.projects[idx] = newName;`, `      socket.on("update_project", ({ id, newName }: { id: string, newName: string }) => {
        if (!serverConfig.projects) serverConfig.projects = [];
        const idx = serverConfig.projects.findIndex(p => p.id === id);
        if (idx !== -1 && newName && !serverConfig.projects.find(p => p.name === newName)) {
          const oldName = serverConfig.projects[idx].name;
          serverConfig.projects[idx].name = newName;`);

// And we need to fix the def migration for update_project. The code is:
//           let updated = false;
//           defects = defects.map(d => {
//             if (d.project === oldName) {
//               updated = true;
//               return { ...d, project: newName };
//             }
//             return d;
//           });
// Let's modify it to migrate Defect.project to Project.id.
// Wait, we need to do it at load time too. Let's do it in AppContext.tsx instead?
// Actually if I keep Defect.project as name, it's easier. I'll just change `delete_project` and `update_project` to accept `id`. Wait, if `Defect.project` is the name, when it's updated, it updates oldName -> newName.
// If I use ID for Defect.project, it requires changing Defect interface, loading it everywhere.
// Let's just keep Defect.project as `id`. Let's migrate DB!
fs.writeFileSync('server.ts', content);
