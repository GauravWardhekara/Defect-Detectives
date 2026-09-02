import fs from 'fs';
let content = fs.readFileSync('src/components/Chatbot.tsx', 'utf-8');

// Button
content = content.replace(/className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center z-50 group"/g, 'className="fixed bottom-10 right-16 w-[60px] h-[60px] bg-white border border-ink-faint rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex items-center justify-center z-50 cursor-pointer text-ink hover:bg-bg-base transition-colors"');

// Header
content = content.replace(/className="h-16 bg-indigo-600 text-white flex items-center justify-between px-4 shrink-0"/g, 'className="h-16 bg-ink text-white flex items-center justify-between px-4 shrink-0"');
content = content.replace(/className="w-8 h-8 bg-white\/20 rounded-lg flex items-center justify-center"/g, 'className="w-8 h-8 bg-white text-ink rounded-lg flex items-center justify-center"');
content = content.replace(/className="text-xs text-indigo-200"/g, 'className="text-xs text-white/50"');
content = content.replace(/className="text-indigo-200 hover:text-white transition-colors p-2 hover:bg-white\/10 rounded-full"/g, 'className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"');

// Body
content = content.replace(/className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"/g, 'className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-base"');
content = content.replace(/bg-indigo-100 text-indigo-600/g, 'bg-ink text-white');
content = content.replace(/bg-white border border-slate-200 text-slate-600/g, 'bg-white border border-ink-faint text-ink');
content = content.replace(/bg-indigo-600 text-white rounded-l-2xl/g, 'bg-ink text-white rounded-l-[16px] rounded-tr-[16px] rounded-br-sm');
content = content.replace(/bg-white border border-slate-200 text-slate-800 rounded-r-2xl/g, 'bg-white border border-ink-faint text-ink rounded-r-[16px] rounded-tl-[16px] rounded-bl-sm');
content = content.replace(/bg-indigo-600 text-white rounded-r-2xl/g, 'bg-ink text-white rounded-r-[16px] rounded-tl-[16px] rounded-bl-sm');
content = content.replace(/bg-white border border-slate-200 text-slate-800 rounded-l-2xl/g, 'bg-white border border-ink-faint text-ink rounded-l-[16px] rounded-tr-[16px] rounded-br-sm');

// Input
content = content.replace(/bg-slate-50 border border-slate-200/g, 'bg-bg-base border border-ink-faint');
content = content.replace(/focus:ring-indigo-500 focus:bg-white/g, 'focus:ring-ink focus:bg-white');
content = content.replace(/bg-indigo-600 text-white/g, 'bg-ink text-white');
content = content.replace(/disabled:bg-slate-300 hover:bg-indigo-700/g, 'disabled:bg-ink-muted hover:opacity-90');
content = content.replace(/text-slate-400/g, 'text-ink-muted');

// Container
content = content.replace(/bottom-6 right-6 w-96 h-\[500px\] bg-white rounded-2xl shadow-2xl border border-slate-200/g, 'bottom-28 right-16 w-96 h-[500px] bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-ink-faint');

fs.writeFileSync('src/components/Chatbot.tsx', content);
