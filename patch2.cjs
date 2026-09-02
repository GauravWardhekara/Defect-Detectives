const fs = require('fs');
let code = fs.readFileSync('src/components/ProjectConfigurationsView.tsx', 'utf8');

code = code.replace(
  /<div className="p-8 flex justify-between items-start border-b border-ink-faint">/,
  '<div className="h-[60px] pl-[32px] pr-8 flex justify-between items-center border-b border-ink-faint text-left">'
);

code = code.replace(
  /<h3 className="font-sans text-\[21px\] font-bold tracking-tight mb-1 cursor-help">Project Configurations<\/h3>/,
  '<h3 className="font-sans text-[14px] font-bold tracking-tight mb-0 cursor-help">Project Configurations</h3>'
);

code = code.replace(
  /className="border-none border-b-\[1.5px\] border-ink-faint py-2 text-base w-\[240px\] outline-none transition-colors focus:border-ink bg-transparent"/,
  'className="border-none border-b-[1.5px] border-ink-faint pt-[3px] pb-[4px] text-[14px] leading-[11px] font-bold text-left w-[240px] outline-none transition-colors focus:border-ink bg-transparent"'
);

code = code.replace(
  /className="px-6 py-2.5 bg-ink text-white rounded-full font-medium text-sm hover:opacity-90 disabled:opacity-50"/,
  'className="px-[20px] h-[30px] leading-[11px] bg-ink text-white rounded-full font-medium text-sm hover:opacity-90 disabled:opacity-50"'
);

code = code.replace(
  /className="text-left px-10 py-4 text-\[0.7rem\] uppercase tracking-\[0.15em\] text-ink-muted border-b border-ink-faint"/g,
  'className="text-left px-10 py-4 text-[10px] leading-[12.8px] uppercase tracking-[0.15em] text-ink-muted border-b border-ink-faint"'
);
code = code.replace(
  /className="text-right px-10 py-4 text-\[0.7rem\] uppercase tracking-\[0.15em\] text-ink-muted border-b border-ink-faint"/g,
  'className="text-right px-10 py-4 text-[10px] leading-[12.8px] uppercase tracking-[0.15em] text-ink-muted border-b border-ink-faint"'
);

fs.writeFileSync('src/components/ProjectConfigurationsView.tsx', code);
