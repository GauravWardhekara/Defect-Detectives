import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `          const importedDefects: Defect[] = [];
          
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row[0] || !row[1]) continue; // Skip invalid rows`;

const replacement = `          const importedDefects: Defect[] = [];
          
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row[0] || !row[1]) continue; // Skip invalid rows
            
            const id = row[0];
            if (defects.some(d => d.id === id) || importedDefects.some(d => d.id === id)) {
              continue; // Skip duplicate records
            }`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
