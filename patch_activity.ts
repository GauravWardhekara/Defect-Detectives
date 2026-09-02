import fs from 'fs';
let content = fs.readFileSync('src/components/ActivityLogsView.tsx', 'utf-8');

// Replace classes
content = content.replace(/bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm/g, 'bg-white rounded-[24px] border border-ink-faint overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col h-full');
content = content.replace(/p-6 border-b border-slate-200 shrink-0 bg-slate-50/g, 'p-10 border-b border-ink-faint shrink-0');
content = content.replace(/text-xl font-bold text-slate-800/g, 'font-serif text-[1.75rem] text-ink');
content = content.replace(/text-slate-400/g, 'text-ink-muted');
content = content.replace(/border-slate-200/g, 'border-ink-faint');
content = content.replace(/bg-indigo-500/g, 'bg-ink');
content = content.replace(/text-slate-800/g, 'text-ink');
content = content.replace(/text-slate-500/g, 'text-ink-muted');
content = content.replace(/text-slate-700/g, 'text-ink font-medium');
content = content.replace(/bg-slate-50 border border-slate-100 rounded-lg p-3 mt-2 shadow-sm/g, 'bg-bg-base border border-ink-faint rounded-[16px] p-4 mt-2 max-w-2xl');
content = content.replace(/text-indigo-600/g, 'text-ink font-mono uppercase text-xs');
content = content.replace(/<Activity className="w-6 h-6 text-indigo-600" \/>/g, '');

fs.writeFileSync('src/components/ActivityLogsView.tsx', content);
