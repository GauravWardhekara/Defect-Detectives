import fs from 'fs';

let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');

// Update H3 and Icon
content = content.replace(
  'className="text-lg font-bold text-ink flex items-center gap-2 cursor-help"',
  'className="text-sm font-bold text-ink flex items-center gap-2 cursor-help uppercase tracking-wider"'
);
content = content.replace(
  '<Sparkles className="w-5 h-5 text-ink" />',
  '<Sparkles className="w-4 h-4 text-ink-muted" />'
);

// Update Button
content = content.replace(
  'className="flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"',
  'className="flex items-center gap-2 px-4 py-1.5 bg-ink text-white rounded-full font-medium text-xs hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"'
);

fs.writeFileSync('src/components/DashboardView.tsx', content);
