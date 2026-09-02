import fs from 'fs';

let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf-8');

// Colors
content = content.replace(/bg-slate-900\/50/g, 'bg-black/50');
content = content.replace(/bg-slate-100/g, 'bg-black/5');
content = content.replace(/bg-slate-200/g, 'bg-black/10');
content = content.replace(/text-slate-900/g, 'text-ink');
content = content.replace(/text-slate-700/g, 'text-ink');
content = content.replace(/divide-slate-100/g, 'divide-ink-faint');

content = content.replace(/bg-indigo-50/g, 'bg-bg-base');
content = content.replace(/border-indigo-100/g, 'border-ink-faint');
content = content.replace(/text-indigo-900/g, 'text-ink');
content = content.replace(/bg-indigo-100/g, 'bg-black/5');

fs.writeFileSync('src/components/SettingsModal.tsx', content);
