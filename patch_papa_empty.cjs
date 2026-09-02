const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetLogic = `        if (results.data && results.data.length > 1) {`;

const replacementLogic = `        if (!results.data || results.data.length <= 1) {
          setAlertMessage("The CSV file is empty or missing data rows.");
          return;
        }
        
        if (results.data && results.data.length > 1) {`;

code = code.replace(targetLogic, replacementLogic);
fs.writeFileSync('src/App.tsx', code);
