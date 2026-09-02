import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Reduce button sizes and padding in the action bar
content = content.replace(/px-6 py-4/g, 'px-4 py-2'); // Search input
content = content.replace(/w-\[400px\] text-\[0.9rem\]/g, 'w-[300px] text-sm'); 
content = content.replace(/px-6 py-3/g, 'px-4 py-2'); // Buttons and selects

// Overall page scroll
content = content.replace(/flex-1 overflow-x-auto min-h-0 relative bg-white border border-ink-faint rounded-\[24px\] shadow-\[0_4px_20px_rgba(0,0,0,0.02)\] flex flex-col/g, 
  'relative bg-white border border-ink-faint rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col w-full overflow-hidden');

fs.writeFileSync('src/App.tsx', content);
