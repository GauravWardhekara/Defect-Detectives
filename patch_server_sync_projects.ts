import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const target = `          if (data.projects) {
             const oldLen = (serverConfig.projects || []).length;
             const merged = Array.from(new Set([...(serverConfig.projects || []), ...data.projects]));
             if (merged.length !== oldLen) {
                serverConfig.projects = merged;
                saveConfig();
             }
          }`;

const replacement = `          if (data.projects) {
             if (JSON.stringify(serverConfig.projects) !== JSON.stringify(data.projects)) {
                serverConfig.projects = data.projects;
                saveConfig();
             }
          }`;

content = content.replace(target, replacement);
fs.writeFileSync('server.ts', content);
