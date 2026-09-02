const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `            const id = row[0];
            if (defects.some(d => d.id === id) || importedDefects.some(d => d.id === id)) {
              continue; // Skip duplicate records
            }`;

const replacementStr = `            let id = row[0];
            if (defects.some(d => d.id === id) || importedDefects.some(d => d.id === id)) {
              id = \`\${id}-\${Math.floor(Math.random() * 10000)}\`;
            }`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', code);
