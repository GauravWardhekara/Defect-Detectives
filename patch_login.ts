import fs from 'fs';

let content = fs.readFileSync('src/components/Login.tsx', 'utf-8');
content = content.replace(
`      if (user) {
        importProfile(user);
      } else {
        alert("Invalid or corrupted profile card.");
      }
    };`,
`      if (user) {
        importProfile(user);
      } else {
        alert("Invalid or corrupted profile card.");
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };`
);
fs.writeFileSync('src/components/Login.tsx', content);
