import fs from 'fs';
let content = fs.readFileSync('src/components/TableView.tsx', 'utf-8');

// Replace table header styles
content = content.replace(/className="bg-slate-50 border-y border-slate-200"/g, 'className="border-b border-ink-faint"');
content = content.replace(/className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"/g, 'className="text-left px-6 py-4 text-[0.7rem] uppercase tracking-[0.15em] text-ink-muted border-b border-ink-faint"');
content = content.replace(/className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"/g, 'className="text-left px-6 py-4 text-[0.7rem] uppercase tracking-[0.15em] text-ink-muted border-b border-ink-faint cursor-pointer hover:bg-black/5 transition-colors"');

// Replace row styles
content = content.replace(/className="hover:bg-slate-50 border-b border-slate-100 transition-colors cursor-pointer group"/g, 'className="hover:bg-black/5 border-b border-ink-faint transition-colors cursor-pointer group"');
content = content.replace(/className="px-6 py-4"/g, 'className="px-6 py-4 text-[0.95rem]"');

// Bulk update bar
content = content.replace(/className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4 flex items-center justify-between flex-wrap gap-4"/g, 'className="bg-bg-base border border-ink-faint rounded-[16px] p-6 mb-4 flex items-center justify-between flex-wrap gap-4 mx-6 mt-6"');
content = content.replace(/className="text-sm font-medium text-indigo-800"/g, 'className="text-sm font-medium text-ink"');
content = content.replace(/className="px-3 py-1.5 border border-indigo-200 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/g, 'className="px-4 py-2 rounded-full border border-ink-faint bg-white font-medium text-xs focus:outline-none focus:border-ink"');
content = content.replace(/className="px-4 py-1.5 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors"/g, 'className="px-6 py-2 bg-ink text-white rounded-full font-medium text-xs hover:opacity-90 transition-opacity"');

// Container
content = content.replace(/className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full"/g, 'className="flex flex-col h-full"');

fs.writeFileSync('src/components/TableView.tsx', content);
