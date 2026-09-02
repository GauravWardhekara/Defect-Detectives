import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(`      socket.on("delete_project", (projectId: string) => {
        if (!serverConfig.projects) return;
        const idx = serverConfig.projects.findIndex(p => p.id === projectId);
        if (idx !== -1) {
          serverConfig.projects.splice(idx, 1);
          saveConfig();
          io.to(serverConfig.orgCode).emit("projects_updated", serverConfig.projects);
          
          // Delete all associated defects
          const originalLen = defects.length;
          defects = defects.filter(d => d.project !== projectName);`, `      socket.on("delete_project", (projectId: string) => {
        if (!serverConfig.projects) return;
        const idx = serverConfig.projects.findIndex(p => p.id === projectId);
        if (idx !== -1) {
          const projectName = serverConfig.projects[idx].name;
          serverConfig.projects.splice(idx, 1);
          saveConfig();
          io.to(serverConfig.orgCode).emit("projects_updated", serverConfig.projects);
          
          // Delete all associated defects
          const originalLen = defects.length;
          defects = defects.filter(d => d.project !== projectName);`);

fs.writeFileSync('server.ts', content);
