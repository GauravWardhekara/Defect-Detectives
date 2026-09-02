import fs from 'fs';

let content = fs.readFileSync('src/components/DefectFormModal.tsx', 'utf-8');

// Container & Overlays
content = content.replace(/bg-slate-900\/50/g, 'bg-black/50');
content = content.replace(/bg-slate-900\/60/g, 'bg-black/60');
content = content.replace(/bg-slate-200/g, 'bg-black/10');
content = content.replace(/bg-slate-100/g, 'bg-black/5');

// Typography & Labels
content = content.replace(/text-slate-700/g, 'text-ink');
content = content.replace(/text-slate-500/g, 'text-ink-muted');
content = content.replace(/text-sm font-medium text-slate-700 mb-1/g, 'text-xs font-semibold text-ink mb-1 uppercase tracking-wider');

// Inputs
content = content.replace(/border-slate-300/g, 'border-ink-faint bg-bg-base');

// Stepper & Colors
content = content.replace(/border-indigo-600/g, 'border-ink');
content = content.replace(/text-indigo-600/g, 'text-ink');
content = content.replace(/text-indigo-700/g, 'text-ink');
content = content.replace(/bg-indigo-50/g, 'bg-black/5');
content = content.replace(/text-indigo-900/g, 'text-ink');
content = content.replace(/border-t-indigo-600/g, 'border-t-ink');
content = content.replace(/bg-indigo-100/g, 'bg-black/10');
content = content.replace(/rgba\(79,70,229,0.1\)/g, 'rgba(0,0,0,0.05)');

fs.writeFileSync('src/components/DefectFormModal.tsx', content);
