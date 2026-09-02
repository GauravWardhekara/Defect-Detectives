import fs from 'fs';
let content = fs.readFileSync('src/components/TableView.tsx', 'utf-8');

content = content.replace(/px-6 py-4/g, 'px-10 py-6');
content = content.replace(/px-6 py-3/g, 'px-10 py-4');

fs.writeFileSync('src/components/TableView.tsx', content);
