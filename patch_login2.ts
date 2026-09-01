import fs from 'fs';

let content = fs.readFileSync('src/components/Login.tsx', 'utf-8');
content = content.replace(
`    const file = e.target.files?.[0];
    if (!file) return;`,
`    const file = e.target.files?.[0];
    if (!file) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }`
);
fs.writeFileSync('src/components/Login.tsx', content);
