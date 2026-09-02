import fs from 'fs';

// App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace(
  'className="bg-ink-faint border-none px-4 py-2 rounded-full font-sans w-[300px] text-sm outline-none"',
  'className="bg-ink-faint border-none px-4 py-1.5 rounded-full font-sans w-[240px] text-xs outline-none"'
);
appContent = appContent.replace(
  /className="px-4 py-2 rounded-full border border-ink bg-transparent font-medium text-sm cursor-pointer hover:bg-black\/5 outline-none "/g,
  'className="px-4 py-1.5 rounded-full border border-ink bg-transparent font-medium text-xs cursor-pointer hover:bg-black/5 outline-none"'
);
appContent = appContent.replace(
  'className="px-4 py-2 rounded-full border border-ink bg-transparent font-medium text-sm cursor-pointer hover:bg-black/5"',
  'className="px-4 py-1.5 rounded-full border border-ink bg-transparent font-medium text-xs cursor-pointer hover:bg-black/5"'
);
appContent = appContent.replace(
  'className="px-4 py-2 rounded-full border border-ink bg-ink text-white font-medium text-sm cursor-pointer hover:opacity-90"',
  'className="px-4 py-1.5 rounded-full border border-ink bg-ink text-white font-medium text-xs cursor-pointer hover:opacity-90"'
);
fs.writeFileSync('src/App.tsx', appContent);

// Layout.tsx
let layoutContent = fs.readFileSync('src/components/Layout.tsx', 'utf-8');
layoutContent = layoutContent.replace(
  'className="font-serif text-[2.5rem] font-semibold italic tracking-tight mb-1"',
  'className="font-sans text-xl font-bold tracking-tight mb-1"'
);
fs.writeFileSync('src/components/Layout.tsx', layoutContent);

