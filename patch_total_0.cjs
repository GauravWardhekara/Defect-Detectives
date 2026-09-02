const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetLogic = `          const total = importedDefects.length;
          if (total === 0) return;`;

const replacementLogic = `          const total = importedDefects.length;
          if (total === 0) {
            setAlertMessage("No new issues were found to import. They may be duplicates of existing issues.");
            return;
          }`;

code = code.replace(targetLogic, replacementLogic);
fs.writeFileSync('src/App.tsx', code);
