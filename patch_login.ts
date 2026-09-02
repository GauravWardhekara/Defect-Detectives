import fs from 'fs';

let content = fs.readFileSync('src/components/Login.tsx', 'utf-8');

// Colors
content = content.replace(/bg-slate-100/g, 'bg-bg-base');
content = content.replace(/bg-slate-900/g, 'bg-ink');
content = content.replace(/bg-slate-800/g, 'bg-ink/90');
content = content.replace(/bg-slate-50/g, 'bg-black/5');
content = content.replace(/text-slate-900/g, 'text-ink');
content = content.replace(/text-slate-700/g, 'text-ink');
content = content.replace(/text-slate-600/g, 'text-ink');
content = content.replace(/text-slate-500/g, 'text-ink-muted');
content = content.replace(/text-slate-400/g, 'text-ink-muted');
content = content.replace(/border-slate-200/g, 'border-ink-faint');
content = content.replace(/border-slate-100/g, 'border-ink-faint');

content = content.replace(/bg-indigo-100/g, 'bg-black/10');
content = content.replace(/bg-indigo-600/g, 'bg-ink');
content = content.replace(/bg-indigo-700/g, 'bg-ink/90');
content = content.replace(/bg-indigo-50/g, 'bg-black/5');
content = content.replace(/text-indigo-600/g, 'text-ink');
content = content.replace(/text-indigo-700/g, 'text-ink');
content = content.replace(/border-indigo-500/g, 'border-ink');
content = content.replace(/ring-indigo-500/g, 'ring-ink');

content = content.replace(/rounded-2xl/g, 'rounded-[24px]');
content = content.replace(/rounded-xl/g, 'rounded-[16px]');
content = content.replace(/rounded-lg/g, 'rounded-[12px]');

// Text sizes
content = content.replace(/text-sm font-medium text-ink mb-1/g, 'text-xs font-semibold text-ink mb-1 uppercase tracking-wider');

fs.writeFileSync('src/components/Login.tsx', content);
