import fs from 'fs';
['src/components/SettingsModal.tsx', 'src/components/DefectFormModal.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/rounded-xl/g, 'rounded-[24px]');
  content = content.replace(/rounded-2xl/g, 'rounded-[24px]');
  content = content.replace(/shadow-xl/g, 'shadow-[0_10px_40px_rgba(0,0,0,0.08)]');
  content = content.replace(/bg-slate-50/g, 'bg-bg-base');
  content = content.replace(/border-slate-200/g, 'border-ink-faint');
  content = content.replace(/border-slate-100/g, 'border-ink-faint');
  content = content.replace(/text-slate-800/g, 'text-ink');
  content = content.replace(/text-slate-600/g, 'text-ink');
  content = content.replace(/text-slate-500/g, 'text-ink-muted');
  content = content.replace(/text-slate-400/g, 'text-ink-muted');
  
  // button fills
  content = content.replace(/bg-indigo-600/g, 'bg-ink');
  content = content.replace(/hover:bg-indigo-700/g, 'hover:bg-ink');
  content = content.replace(/text-indigo-600/g, 'text-ink');
  content = content.replace(/border-indigo-200/g, 'border-ink-faint');
  content = content.replace(/ring-indigo-500/g, 'ring-ink');
  content = content.replace(/focus:border-indigo-500/g, 'focus:border-ink');
  
  fs.writeFileSync(file, content);
});
