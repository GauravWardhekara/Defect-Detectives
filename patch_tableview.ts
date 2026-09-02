import fs from 'fs';

let content = fs.readFileSync('src/components/TableView.tsx', 'utf-8');

// Colors
content = content.replace(/bg-slate-100/g, 'bg-bg-base');
content = content.replace(/bg-slate-50/g, 'bg-black/5');
content = content.replace(/text-slate-800/g, 'text-ink');
content = content.replace(/text-slate-700/g, 'text-ink');
content = content.replace(/text-slate-600/g, 'text-ink');
content = content.replace(/text-slate-500/g, 'text-ink-muted');
content = content.replace(/text-slate-400/g, 'text-ink-muted');
content = content.replace(/border-slate-300/g, 'border-ink-faint bg-bg-base');
content = content.replace(/border-slate-200/g, 'border-ink-faint');

content = content.replace(/text-indigo-700/g, 'text-ink');
content = content.replace(/text-indigo-600/g, 'text-ink');
content = content.replace(/bg-indigo-600/g, 'bg-ink');
content = content.replace(/bg-indigo-50\/30/g, 'bg-black/5');
content = content.replace(/focus:ring-indigo-500\/20/g, 'focus:ring-ink');
content = content.replace(/focus:ring-indigo-500/g, 'focus:ring-ink');

fs.writeFileSync('src/components/TableView.tsx', content);
