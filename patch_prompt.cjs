const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `          let fallbackProject: string | null = null;
          const needsFallback = rows.slice(1).some(row => row[0] && row[1] && (!row[3] || row[3].trim() === ''));
          
          if (needsFallback) {
            const defaultProj = filterProject !== 'All' ? filterProject : '';
            const userInput = window.prompt(
              "Some issues in the CSV don't have a project assigned. Please enter a project name to import them into:",
              defaultProj
            );
            
            if (userInput === null) return; // User cancelled
            if (!userInput.trim()) {
              setAlertMessage("A project name is required to import these defects.");
              return;
            }
            fallbackProject = userInput.trim();
          }`;

const replacementStr = `          let fallbackProject: string | null = null;
          const needsFallback = rows.slice(1).some(row => row[0] && row[1] && (!row[3] || row[3].trim() === ''));
          
          // Since window.prompt might be blocked in iframes, we should use a default if it's missing, or fallback project name.
          if (needsFallback) {
             fallbackProject = filterProject !== 'All' && filterProject !== '' ? filterProject : 'Imported Project';
          }`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', code);
