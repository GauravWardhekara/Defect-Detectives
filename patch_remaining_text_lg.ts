import fs from 'fs';

let formModal = fs.readFileSync('src/components/DefectFormModal.tsx', 'utf-8');
formModal = formModal.replace(
  'className="text-lg font-semibold text-ink"',
  'className="text-xs font-bold text-ink uppercase tracking-wider"'
);
formModal = formModal.replace(
  'className="text-lg font-bold text-ink"',
  'className="text-base font-bold text-ink"'
);
fs.writeFileSync('src/components/DefectFormModal.tsx', formModal);

let projectView = fs.readFileSync('src/components/ProjectConfigurationsView.tsx', 'utf-8');
projectView = projectView.replace(
  'className="text-lg font-medium text-ink mb-4"',
  'className="text-xs font-bold text-ink uppercase tracking-wider mb-4"'
);
fs.writeFileSync('src/components/ProjectConfigurationsView.tsx', projectView);

let kanban = fs.readFileSync('src/components/KanbanBoard.tsx', 'utf-8');
kanban = kanban.replace(
  'className="font-serif font-semibold text-lg text-ink mb-2 leading-snug leading-snug"',
  'className="font-serif font-semibold text-[1.1rem] text-ink mb-2 leading-snug"'
);
fs.writeFileSync('src/components/KanbanBoard.tsx', kanban);

