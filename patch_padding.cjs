const fs = require('fs');

const files = ['src/components/SettingsModal.tsx', 'src/components/ProfileModal.tsx'];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  // Replace the footer container classes to include bottom padding and match the requested spacing
  code = code.replace(
    /<div className="pt-6 mt-4 border-t border-ink-faint flex items-center justify-center gap-3">/,
    '<div className="border-t border-ink-faint flex items-center justify-center gap-3" style={{ marginTop: \'2px\', paddingTop: \'23px\', paddingBottom: \'23px\' }}>'
  );
  
  fs.writeFileSync(file, code);
});
