import fs from 'fs';

let content = fs.readFileSync('src/components/DefectFormModal.tsx', 'utf-8');

content = content.replace(
  "const { addDefect, updateDefect, deleteDefect, projects, users, currentUser, addProject, addUser, networkConfig, aiConfig } = useAppContext();",
  "const { addDefect, updateDefect, deleteDefect, projects, users, currentUser, addProject, addUser, networkConfig, aiConfig, filterProject } = useAppContext();"
);

content = content.replace(
  "project: projects[0],",
  "project: filterProject !== 'All' ? filterProject : projects[0],"
);

fs.writeFileSync('src/components/DefectFormModal.tsx', content);
