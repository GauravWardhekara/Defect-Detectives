import fs from 'fs';
let content = fs.readFileSync('src/components/ProfileModal.tsx', 'utf-8');

// Container & Header
content = content.replace(/bg-white rounded-xl shadow-xl/g, 'bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-ink-faint');
content = content.replace(/p-4 border-b border-slate-100 bg-slate-50\/50/g, 'p-6 border-b border-ink-faint shrink-0 bg-bg-base');
content = content.replace(/text-lg font-bold text-slate-800/g, 'text-xl font-bold text-ink');
content = content.replace(/text-indigo-600/g, 'text-ink');
content = content.replace(/text-slate-400 hover:text-slate-600 hover:bg-slate-100/g, 'text-ink-muted hover:text-ink hover:bg-black/5');

// Inputs & Labels
content = content.replace(/text-sm font-medium text-slate-700 mb-1/g, 'text-xs font-semibold text-ink mb-1 uppercase tracking-wider');
content = content.replace(/border border-slate-200/g, 'border border-ink-faint bg-bg-base');
content = content.replace(/focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/g, 'focus:ring-2 focus:ring-ink');

// Buttons
content = content.replace(/pt-4 border-t border-slate-100/g, 'pt-6 mt-4 border-t border-ink-faint flex flex-row gap-3');
content = content.replace(/w-full bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-indigo-700/g, 'w-full bg-ink text-white text-xs font-medium py-3 rounded-full hover:opacity-90');
content = content.replace(/w-full bg-white border border-slate-200 text-slate-700 text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50/g, 'w-full bg-white border border-ink-faint text-ink text-xs font-medium py-3 rounded-full flex items-center justify-center gap-2 hover:bg-bg-base');

fs.writeFileSync('src/components/ProfileModal.tsx', content);
