const fs = require('fs');
let code = fs.readFileSync('src/components/ProjectConfigurationsView.tsx', 'utf8');

code = code.replace(
  /className="border-none border-b-\[1\.5px\] border-ink-faint pt-\[3px\] pb-\[4px\] text-\[14px\] leading-\[11px\] font-bold text-left w-\[240px\] outline-none transition-colors focus:border-ink bg-transparent"/,
  'className="border-[0.8px] border-solid border-ink-faint rounded-[2.68px] px-2 pt-[3px] pb-[4px] text-[14px] leading-[11px] font-bold text-left w-[240px] outline-none transition-colors focus:border-ink bg-transparent"'
);

code = code.replace(
  /className="px-\[20px\] h-\[30px\] leading-\[11px\] bg-ink text-white rounded-full font-medium text-sm hover:opacity-90 disabled:opacity-50"/,
  'className="px-[20px] h-[30px] leading-[11px] bg-ink text-white rounded-full font-medium text-[12px] hover:opacity-90 disabled:opacity-50"'
);

fs.writeFileSync('src/components/ProjectConfigurationsView.tsx', code);
