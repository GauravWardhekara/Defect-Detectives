import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /onClick=\{\(\) => \{\s*if \(projects\.length === 0\) \{\s*const newProj = window\.prompt\("Please add a project before creating a defect:"\);\s*if \(newProj && newProj\.trim\(\)\) \{\s*addProject\(newProj\.trim\(\)\);\s*if \(socket\) socket\.emit\('add_project', newProj\.trim\(\)\);\s*setSelectedDefect\(undefined\);\s*setIsFormOpen\(true\);\s*\}\s*\} else \{\s*setSelectedDefect\(undefined\);\s*setIsFormOpen\(true\);\s*\}\s*\}\}/g;

const replacement = `onClick={() => {
              if (projects.length === 0) {
                alert("There are no Projects. Please add a project to continue.");
                setActiveView('projects');
              } else {
                setSelectedDefect(undefined); 
                setIsFormOpen(true);
              }
            }}`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
