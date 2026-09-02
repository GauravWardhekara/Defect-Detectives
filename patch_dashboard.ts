import fs from 'fs';

let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');

content = content.replace(
  'className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-6 shadow-sm"',
  'className="bg-bg-base border border-ink-faint rounded-[24px] p-6 shadow-sm"'
);
content = content.replace(
  'text-lg font-bold text-indigo-900',
  'text-lg font-bold text-ink'
);
content = content.replace(
  'text-indigo-600',
  'text-ink'
);
content = content.replace(
  'className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 shrink-0"',
  'className="flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"'
);
content = content.replace(
  'className="mt-4 p-5 bg-white rounded-lg border border-indigo-50 shadow-sm text-slate-700 text-sm leading-relaxed whitespace-pre-wrap"',
  'className="mt-4 p-5 bg-white rounded-[16px] border border-ink-faint shadow-sm text-ink text-sm leading-relaxed whitespace-pre-wrap"'
);
content = content.replace(
  'className="text-[10px] text-blue-600 mt-2 font-medium"',
  'className="text-[10px] text-ink-muted mt-2 font-medium"'
);
content = content.replace(
  'bg-indigo-200',
  'bg-slate-200'
);
content = content.replace(
  'bg-blue-200',
  'bg-slate-300'
);

fs.writeFileSync('src/components/DashboardView.tsx', content);
