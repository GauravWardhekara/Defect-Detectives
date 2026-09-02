const fs = require('fs');

const files = ['src/components/SettingsModal.tsx', 'src/components/ProfileModal.tsx'];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');

  // Add borderWidth to inputs and selects (which don't have existing style objects)
  code = code.replace(/className="w-full bg-bg-base border border-ink-faint ([^"]+)"/g, 'className="w-full bg-bg-base border border-ink-faint $1" style={{ borderWidth: \'0.8px\' }}');
  code = code.replace(/className="w-full border border-ink-faint ([^"]+)"/g, 'className="w-full border border-ink-faint $1" style={{ borderWidth: \'0.8px\' }}');
  
  // Add borderWidth to containers
  code = code.replace(/className="p-3 bg-bg-base border border-ink-faint rounded-\[12px\] flex items-center justify-between"/g, 'className="p-3 bg-bg-base border border-ink-faint rounded-[12px] flex items-center justify-between" style={{ borderWidth: \'0.8px\' }}');
  
  code = code.replace(/className="border border-ink-faint rounded-\[12px\] divide-y divide-ink-faint bg-bg-base"/g, 'className="border border-ink-faint rounded-[12px] divide-y divide-ink-faint bg-bg-base" style={{ borderWidth: \'0.8px\' }}');
  
  // Test connection button
  code = code.replace(/className="w-full py-1.5 bg-black\/5 hover:bg-black\/10 text-ink font-medium rounded-\[12px\] text-xs transition-colors border border-ink-faint disabled:opacity-50"/g, 'className="w-full py-1.5 bg-black/5 hover:bg-black/10 text-ink font-medium rounded-[12px] text-xs transition-colors border border-ink-faint disabled:opacity-50" style={{ borderWidth: \'0.8px\' }}');

  // Also avatar
  code = code.replace(/className="w-6 h-6 rounded-full bg-black\/5 flex items-center justify-center text-xs font-bold text-ink border border-ink-faint"/g, 'className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold text-ink border border-ink-faint" style={{ borderWidth: \'0.8px\' }}');
  
  // Main modal container (in ProfileModal)
  code = code.replace(/className="bg-white rounded-\[24px\] shadow-\[0_10px_40px_rgba\(0,0,0,0.08\)\] border border-ink-faint w-full max-w-sm overflow-hidden flex flex-col"/g, 'className="bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-ink-faint w-full max-w-sm overflow-hidden flex flex-col" style={{ borderWidth: \'0.8px\' }}');

  // Cancel button and Save Profile / Download buttons (which already have style objects)
  code = code.replace(/style=\{\{ height: '29\.5875px', width: '110\.788px', lineHeight: '8px' \}\}/g, 'style={{ height: \'29.5875px\', width: \'110.788px\', lineHeight: \'8px\', borderWidth: \'0.8px\' }}');

  fs.writeFileSync(file, code);
});
