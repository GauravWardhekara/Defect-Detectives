import fs from 'fs';

const patchFile = (file: string, replacements: [RegExp | string, string][]) => {
  let content = fs.readFileSync(file, 'utf-8');
  replacements.forEach(([search, replace]) => {
    content = content.replace(search, replace);
  });
  fs.writeFileSync(file, content);
};

// TableView
patchFile('src/components/TableView.tsx', [
  [/"flex flex-col h-full"/g, '"flex flex-col w-full"'],
  [/"flex-1 overflow-auto"/g, '"w-full overflow-x-auto"']
]);

// ProjectConfigurationsView
patchFile('src/components/ProjectConfigurationsView.tsx', [
  [/"flex flex-col h-full bg-white rounded-\[24px\]"/g, '"flex flex-col w-full bg-white rounded-[24px]"'],
  [/"flex flex-col h-full"/g, '"flex flex-col w-full"'],
  [/"flex-1 overflow-auto"/g, '"w-full overflow-x-auto"']
]);

// ActivityLogsView
patchFile('src/components/ActivityLogsView.tsx', [
  [/"flex flex-col h-full"/g, '"flex flex-col w-full"'],
  [/"flex-1 overflow-auto p-6"/g, '"w-full p-10"'] // reduced padding earlier was maybe p-10
]);

// KanbanBoard
patchFile('src/components/KanbanBoard.tsx', [
  [/"flex-1 flex gap-6 overflow-x-auto pb-4"/g, '"flex gap-6 overflow-x-auto pb-4 min-h-[500px]"'], // min-h to ensure it looks okay if empty
  [/"flex flex-col h-full"/g, '"flex flex-col w-full"'],
  [/"flex-1 min-h-0"/g, '"w-full"'], // remove min-h-0 constraint from kanban columns container? Wait, Kanban columns usually have overflow-y-auto on themselves. Let's let them expand.
  [/"flex-1 overflow-y-auto p-3 space-y-3"/g, '"p-4 space-y-4"'] // kanban column content should just expand
]);

