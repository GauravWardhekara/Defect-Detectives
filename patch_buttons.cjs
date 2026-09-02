const fs = require('fs');

const file = 'src/components/SettingsModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// Container
code = code.replace(
  /<div className="pt-6 mt-4 border-t border-ink-faint flex items-center">/,
  '<div className="pt-6 mt-4 border-t border-ink-faint flex items-center justify-center gap-3">'
);

// Cancel Button
code = code.replace(
  /<button type="button" onClick={onClose} className="bg-white border border-ink-faint text-slate-700 font-medium rounded-full flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors" style=\{\{ fontSize: '12px', lineHeight: '8px', height: '31\.6px', width: '171\.738px', paddingBottom: '10px', marginRight: '0px', marginLeft: '11px' \}\}>/,
  '<button type="button" onClick={onClose} className="bg-white border border-ink-faint text-slate-700 text-[10px] font-medium rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors" style={{ height: \'29.5875px\', width: \'110.788px\', lineHeight: \'8px\' }}>'
);

// Save Button
code = code.replace(
  /<button type="button" onClick={handleSaveAi} className="bg-ink text-white text-xs font-medium rounded-full hover:opacity-90 transition-colors flex items-center justify-center gap-2" style=\{\{ height: '29\.5875px', width: '110\.788px', lineHeight: '8px', marginLeft: '10px' \}\}>/,
  '<button type="button" onClick={handleSaveAi} className="bg-ink text-white text-[10px] font-medium rounded-full hover:opacity-90 transition-colors flex items-center justify-center" style={{ height: \'29.5875px\', width: \'110.788px\', lineHeight: \'8px\' }}>'
);

// Paragraph text-sm -> text-xs
code = code.replace(
  /<p className="text-sm">\s*Your defect data is encrypted at rest using AES-256-CBC, and your local profile is secured with the native Web Crypto API \(AES-GCM\)\. Master keys are kept locally, ensuring no cloud dependency\.\s*<\/p>/,
  '<p className="text-[10px] leading-relaxed">\n              Your defect data is encrypted at rest using AES-256-CBC, and your local profile is secured with the native Web Crypto API (AES-GCM). Master keys are kept locally, ensuring no cloud dependency.\n            </p>'
);

fs.writeFileSync(file, code);

// Also patch ProfileModal.tsx to match symmetry
const file2 = 'src/components/ProfileModal.tsx';
let code2 = fs.readFileSync(file2, 'utf8');

code2 = code2.replace(
  /<div className="pt-6 mt-4 border-t border-ink-faint flex items-center">/,
  '<div className="pt-6 mt-4 border-t border-ink-faint flex items-center justify-center gap-3">'
);

code2 = code2.replace(
  /<button \s*onClick=\{handleUpdateProfile\} \s*className="bg-ink text-white text-xs font-medium rounded-full hover:opacity-90 transition-colors"\s*style=\{\{ height: '29\.5875px', width: '110\.788px', lineHeight: '8px', marginLeft: '10px' \}\}\s*>/,
  '<button \n                onClick={handleUpdateProfile} \n                className="bg-ink text-white text-[10px] font-medium rounded-full hover:opacity-90 transition-colors flex items-center justify-center"\n                style={{ height: \'29.5875px\', width: \'110.788px\', lineHeight: \'8px\' }}\n              >'
);

code2 = code2.replace(
  /<button \s*onClick=\{handleDownload\} \s*className="bg-white border border-ink-faint bg-bg-base text-slate-700 font-medium rounded-full flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"\s*style=\{\{ fontSize: '12px', lineHeight: '8px', height: '31\.6px', width: '171\.738px', paddingBottom: '10px', marginRight: '0px', marginLeft: '11px' \}\}\s*>/,
  '<button \n                onClick={handleDownload} \n                className="bg-white border border-ink-faint bg-bg-base text-slate-700 text-[10px] font-medium rounded-full flex items-center justify-center gap-1 hover:bg-slate-50 transition-colors"\n                style={{ height: \'29.5875px\', width: \'110.788px\', lineHeight: \'8px\' }}\n              >'
);

fs.writeFileSync(file2, code2);
