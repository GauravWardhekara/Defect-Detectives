import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');

const target = `      socket.on("update_project", ({ oldName, newName }: { oldName: string, newName: string }) => {`;

const replacement = `      socket.on("delete_project", (projectName: string) => {
        if (!serverConfig.projects) return;
        const idx = serverConfig.projects.indexOf(projectName);
        if (idx !== -1) {
          serverConfig.projects.splice(idx, 1);
          saveConfig();
          io.to(serverConfig.orgCode).emit("projects_updated", serverConfig.projects);
          
          // Delete all associated defects
          const originalLen = defects.length;
          defects = defects.filter(d => d.project !== projectName);
          if (defects.length !== originalLen) {
            saveDefects();
            io.to(serverConfig.orgCode).emit("sync", defects);
          }
        }
      });

      socket.on("update_project", ({ oldName, newName }: { oldName: string, newName: string }) => {`;

content = content.replace(target, replacement);
fs.writeFileSync('server.ts', content);
