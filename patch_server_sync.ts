import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const ioTarget = `  const server = http.createServer(app);`;

const ioReplacement = `  const server = http.createServer(app);
  let io: Server | null = null;`;

content = content.replace(ioTarget, ioReplacement);

const constIoTarget = `    const io = new Server(server, { cors: { origin: "*" } });`;
const constIoReplacement = `    io = new Server(server, { cors: { origin: "*" } });`;

content = content.replace(constIoTarget, constIoReplacement);

const apiSync = `
  app.post("/api/sync", (req, res) => {
    const incomingDefects = req.body.defects || [];
    let changed = false;
    for (const defect of incomingDefects) {
      const existing = defects.find((d: any) => d.id === defect.id);
      if (!existing) {
        defects.push(defect);
        changed = true;
      } else {
        if (new Date(defect.updatedAt || 0) > new Date(existing.updatedAt || 0)) {
          Object.assign(existing, defect);
          changed = true;
        }
      }
    }
    if (changed) {
      saveDefects();
      if (isMaster && io) {
        io.to(serverConfig.orgCode).emit("sync", defects);
      }
    }
    res.json({ defects, projects: serverConfig.projects });
  });

  // Background auto-sync for non-master nodes
  setInterval(async () => {
    if (!isMaster && masterUrl) {
      try {
        const response = await fetch(\`\${masterUrl}/api/sync\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ defects })
        });
        if (response.ok) {
          const data = await response.json();
          let changed = false;
          for (const defect of data.defects || []) {
            const existing = defects.find((d: any) => d.id === defect.id);
            if (!existing) {
              defects.push(defect);
              changed = true;
            } else if (new Date(defect.updatedAt || 0) > new Date(existing.updatedAt || 0)) {
              Object.assign(existing, defect);
              changed = true;
            }
          }
          if (changed) saveDefects();
          
          if (data.projects) {
             const oldLen = (serverConfig.projects || []).length;
             const merged = Array.from(new Set([...(serverConfig.projects || []), ...data.projects]));
             if (merged.length !== oldLen) {
                serverConfig.projects = merged;
                saveConfig();
             }
          }
        }
      } catch (e) {
         // silently fail background sync if master is unreachable
      }
    } else if (isMaster) {
      // Master can also sync with itself just to trigger save if there was some memory updates?
      // Not needed.
    }
  }, 10000); // 10 seconds idle sync
`;

const insertPoint = `  app.post("/api/promote", (req, res) => {`;
content = content.replace(insertPoint, apiSync + '\\n' + insertPoint);

fs.writeFileSync('server.ts', content);
