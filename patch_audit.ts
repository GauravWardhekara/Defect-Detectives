import fs from 'fs';

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

content = content.replace(/id: \`audit-\$\{Date\.now\(\)\}\`,/g, "id: `audit-${Date.now()}-${uuidv4()}`,");
content = content.replace(/id: \`audit-\$\{Date\.now\(\)\}-\$\{id\}\`,/g, "id: `audit-${Date.now()}-${id}-${uuidv4()}`,");

fs.writeFileSync('src/context/AppContext.tsx', content);
