const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

// Header
code = code.replace(
  /<div className="flex items-center justify-between p-5 border-b border-ink-faint shrink-0">/,
  '<div className="flex items-center justify-between px-5 border-b border-ink-faint shrink-0" style={{ height: \'50px\' }}>'
);

// Footer
code = code.replace(
  /<div className="p-5 border-t border-ink-faint bg-bg-base flex justify-end gap-3 shrink-0">/,
  '<div className="pt-6 mt-4 border-t border-ink-faint flex items-center">'
);

// Cancel button (secondary, white)
code = code.replace(
  /<button type="button" onClick={onClose} className="px-6 py-2 bg-white text-ink font-medium hover:bg-black\/5 rounded-\[16px\] shadow-sm border border-ink-faint transition-colors flex items-center gap-2">/,
  '<button type="button" onClick={onClose} className="bg-white border border-ink-faint text-slate-700 font-medium rounded-full flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors" style={{ fontSize: \'12px\', lineHeight: \'8px\', height: \'31.6px\', width: \'171.738px\', paddingBottom: \'10px\', marginRight: \'0px\', marginLeft: \'11px\' }}>'
);

// Save button (primary, blue)
code = code.replace(
  /<button type="button" onClick={handleSaveAi} className="px-6 py-2 bg-ink text-white font-medium hover:bg-ink rounded-\[16px\] shadow-sm transition-colors flex items-center gap-2">/,
  '<button type="button" onClick={handleSaveAi} className="bg-ink text-white text-xs font-medium rounded-full hover:opacity-90 transition-colors flex items-center justify-center gap-2" style={{ height: \'29.5875px\', width: \'110.788px\', lineHeight: \'8px\', marginLeft: \'10px\' }}>'
);

fs.writeFileSync('src/components/SettingsModal.tsx', code);
