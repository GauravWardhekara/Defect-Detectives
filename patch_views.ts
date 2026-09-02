import fs from 'fs';

let content = fs.readFileSync('src/components/ActivityLogsView.tsx', 'utf-8');
content = content.replace(
  'className="font-serif text-[1.75rem] text-ink"',
  'className="font-sans text-[21px] font-bold tracking-tight text-ink"'
);
content = content.replace(
  '<Activity className="w-6 h-6 text-ink font-mono uppercase text-xs" />',
  '<Activity className="w-5 h-5 text-ink" />'
);
content = content.replace(
  'p-10 border-b border-ink-faint shrink-0 flex items-center gap-3',
  'p-8 border-b border-ink-faint shrink-0 flex items-center gap-3'
);
fs.writeFileSync('src/components/ActivityLogsView.tsx', content);

let projContent = fs.readFileSync('src/components/ProjectConfigurationsView.tsx', 'utf-8');
projContent = projContent.replace(
  '<h3 className="font-serif text-[1.75rem] mb-2">{selectedProject.name}</h3>',
  '<h3 className="font-sans text-[21px] font-bold tracking-tight mb-1">{selectedProject.name}</h3>'
);
projContent = projContent.replace(
  '<h3 className="font-serif text-[1.75rem] mb-2">Project Configurations</h3>',
  '<h3 className="font-sans text-[21px] font-bold tracking-tight mb-1">Project Configurations</h3>'
);
projContent = projContent.replace(
  'className="p-10 border-b border-ink-faint"',
  'className="p-8 border-b border-ink-faint"'
);
fs.writeFileSync('src/components/ProjectConfigurationsView.tsx', projContent);

