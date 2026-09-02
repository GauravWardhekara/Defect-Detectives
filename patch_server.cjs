const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes('platforms: { id: string, name: string }[]')) {
  code = code.replace(
    'projects: { id: string, name: string }[]',
    'projects: { id: string, name: string }[], platforms?: { id: string, name: string }[]'
  );
}
if (!code.includes('platforms?: { id: string, name: string }[]')) {
  code = code.replace(
    'projects?: { id: string, name: string }[]',
    'projects?: { id: string, name: string }[], platforms?: { id: string, name: string }[]'
  );
}

// Add emit of platforms in auth_success
code = code.replace(
  /projects: serverConfig\.projects \}\)/g,
  'projects: serverConfig.projects, platforms: serverConfig.platforms || [] })'
);

if (!code.includes('socket.on("add_platform"')) {
  const projectEvent = `socket.on("add_project", (projectName: string) => {
        if (!serverConfig.projects) serverConfig.projects = [];
        if (!serverConfig.projects.find(p => p.name === projectName)) {
          serverConfig.projects.push({ id: crypto.randomBytes(4).toString("hex"), name: projectName });
          saveConfig();
          io.to(serverConfig.orgCode).emit("projects_updated", serverConfig.projects);
        }
      });`;
  const platformEvent = `
      socket.on("add_platform", (platformName: string) => {
        if (!serverConfig.platforms) serverConfig.platforms = [];
        if (!serverConfig.platforms.find(p => p.name === platformName)) {
          serverConfig.platforms.push({ id: crypto.randomBytes(4).toString("hex"), name: platformName });
          saveConfig();
          io.to(serverConfig.orgCode).emit("platforms_updated", serverConfig.platforms);
        }
      });`;
  code = code.split(projectEvent).join(projectEvent + platformEvent);
}

fs.writeFileSync('server.ts', code);
