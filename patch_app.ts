import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const targetImport = `  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    Papa.parse(file, {
      complete: (results) => {
        if (results.data && results.data.length > 1) {
          // Quick manual parsing to match our format
          const rows = results.data as any[][];
          const importedDefects: Defect[] = [];
          
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row[0] || !row[1]) continue; // Skip invalid rows
            
            importedDefects.push({
              id: row[0],
              title: row[1],
              description: row[2] || '',
              project: row[3] || 'General',
              module: row[4] || '',
              priority: row[5] || 'Medium',
              severity: row[6] || 'Minor',
              status: row[7] || 'Open',
              assignee: row[8] || 'Unassigned',
              reporter: row[9] || 'Unknown',
              reportedVersion: row[10] || '',
              targetFixVersion: row[11] || '',
              reproductionSteps: row[12] || '',
              expectedBehavior: row[13] || '',
              actualBehavior: row[14] || '',
              rootCauseAnalysis: row[15] || '',
              resolutionNotes: row[16] || '',
              comments: row[17] || '',
              imageUrl: row[18] || '',
              createdAt: row[19] || new Date().toISOString(),
              updatedAt: row[20] || new Date().toISOString(),
            } as Defect);
          }

          importedDefects.forEach(d => {`;

const replaceImport = `  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    Papa.parse(file, {
      complete: (results) => {
        if (results.data && results.data.length > 1) {
          const rows = results.data as any[][];
          
          // Check if any row is missing a project
          let fallbackProject: string | null = null;
          const needsFallback = rows.slice(1).some(row => row[0] && row[1] && (!row[3] || row[3].trim() === ''));
          
          if (needsFallback) {
            const defaultProj = filterProject !== 'All' ? filterProject : '';
            const userInput = window.prompt(
              "Some issues in the CSV don't have a project assigned. Please enter a project name to import them into:",
              defaultProj
            );
            
            if (userInput === null) return; // User cancelled
            if (!userInput.trim()) {
              alert("A project name is required to import these defects.");
              return;
            }
            fallbackProject = userInput.trim();
          }

          const importedDefects: Defect[] = [];
          
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row[0] || !row[1]) continue; // Skip invalid rows
            
            const rowProj = row[3] && row[3].trim() !== '' ? row[3].trim() : fallbackProject;
            if (rowProj && !projects.includes(rowProj)) {
              addProject(rowProj);
              if (socket) socket.emit('add_project', rowProj);
            }

            importedDefects.push({
              id: row[0],
              title: row[1],
              description: row[2] || '',
              project: rowProj || 'General',
              module: row[4] || '',
              priority: row[5] || 'Medium',
              severity: row[6] || 'Minor',
              status: row[7] || 'Open',
              assignee: row[8] || 'Unassigned',
              reporter: row[9] || 'Unknown',
              reportedVersion: row[10] || '',
              targetFixVersion: row[11] || '',
              reproductionSteps: row[12] || '',
              expectedBehavior: row[13] || '',
              actualBehavior: row[14] || '',
              rootCauseAnalysis: row[15] || '',
              resolutionNotes: row[16] || '',
              comments: row[17] || '',
              imageUrl: row[18] || '',
              createdAt: row[19] || new Date().toISOString(),
              updatedAt: row[20] || new Date().toISOString(),
            } as Defect);
          }

          importedDefects.forEach(d => {`;

content = content.replace(targetImport, replaceImport);

const targetBtn = `<button
            onClick={() => { setSelectedDefect(undefined); setIsFormOpen(true); }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors flex items-center gap-1"
          >`;

const replaceBtn = `<button
            onClick={() => { 
              if (projects.length === 0) {
                const newProj = window.prompt("Please add a project before creating a defect:");
                if (newProj && newProj.trim()) {
                  addProject(newProj.trim());
                  if (socket) socket.emit('add_project', newProj.trim());
                  setSelectedDefect(undefined); 
                  setIsFormOpen(true);
                }
              } else {
                setSelectedDefect(undefined); 
                setIsFormOpen(true);
              }
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors flex items-center gap-1"
          >`;

content = content.replace(targetBtn, replaceBtn);

// Also need to get projects, addProject, filterProject from useAppContext in App.tsx
if (!content.includes('filterProject')) {
  content = content.replace(
    `const { defects, setDefects, auditTrail, networkConfig, socket, authStatus } = useAppContext();`,
    `const { defects, setDefects, auditTrail, networkConfig, socket, authStatus, projects, addProject, filterProject } = useAppContext();`
  );
} else if (!content.includes('projects') || !content.includes('addProject')) {
  // if filterProject was there but missing others, replace appropriately (this is robust)
  content = content.replace(
    /const \{ defects.*?\} = useAppContext\(\);/,
    `const { defects, setDefects, auditTrail, networkConfig, socket, authStatus, projects, addProject, filterProject } = useAppContext();`
  );
}

fs.writeFileSync('src/App.tsx', content);
