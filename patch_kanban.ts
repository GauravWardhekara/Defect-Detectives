import fs from 'fs';

let content = fs.readFileSync('src/components/KanbanBoard.tsx', 'utf-8');

content = content.replace(
  "isDraggingOver ? 'bg-indigo-50/50' : ''",
  "isDraggingOver ? 'bg-black/5' : ''"
);
content = content.replace(
  'bg-indigo-100',
  'bg-slate-200'
);
content = content.replace(
  'text-indigo-700',
  'text-ink'
);
content = content.replace(
  'bg-slate-100',
  'bg-bg-base'
);
content = content.replace(
  'border-slate-200',
  'border-ink-faint'
);

fs.writeFileSync('src/components/KanbanBoard.tsx', content);
