const fs = require('fs');
let code = fs.readFileSync('src/components/DefectFormModal.tsx', 'utf8');

code = code.replace(
  'filterProject, platforms, addPlatform } = useAppContext();',
  'filterProject, platforms, addPlatform, socket } = useAppContext();'
);

code = code.replace(
  'addProject(newProj.trim());',
  'addProject(newProj.trim());\n      if (socket) socket.emit("add_project", newProj.trim());'
);

code = code.replace(
  'addPlatform(newPlat.trim());',
  'addPlatform(newPlat.trim());\n      if (socket) socket.emit("add_platform", newPlat.trim());'
);

fs.writeFileSync('src/components/DefectFormModal.tsx', code);
