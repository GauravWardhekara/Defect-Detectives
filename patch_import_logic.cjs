const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetImportLogic = 
`          importedDefects.forEach(d => {
            if (socket) {
              socket.emit('add_defect', d);
            }
          });`;

const replacementLogic = 
`          // Process emission asynchronously to show real-time progress
          const total = importedDefects.length;
          if (total === 0) return;
          
          setImportProgress({ current: 0, total });
          
          let i = 0;
          const chunkSize = 10;
          
          const processChunk = () => {
            const end = Math.min(i + chunkSize, total);
            for (; i < end; i++) {
              const d = importedDefects[i];
              if (socket) {
                socket.emit('add_defect', d);
              } else {
                // If offline, just update context directly (though the app usually requires a socket)
                setDefects(prev => [...prev, d]);
              }
            }
            
            setImportProgress({ current: i, total });
            
            if (i < total) {
              requestAnimationFrame(processChunk);
            } else {
              setTimeout(() => {
                setImportProgress(null);
                setAlertMessage(\`Successfully imported \${total} issues.\`);
              }, 500); // Small delay to let user see 100%
            }
          };
          
          requestAnimationFrame(processChunk);`;

code = code.replace(targetImportLogic, replacementLogic);

// We should also replace the setDefects if socket doesn't exist just in case. Wait, if it doesn't have a socket it already doesn't do anything currently (except it depends on AppContext which syncs). Let's keep it robust.

fs.writeFileSync('src/App.tsx', code);
