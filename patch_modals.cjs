const fs = require('fs');
const files = ['src/components/ProfileModal.tsx', 'src/components/SettingsModal.tsx'];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');

  // H2 sizes
  code = code.replace(/text-\[21px\]/g, 'text-[16px]');
  // Labels
  code = code.replace(/text-xs font-semibold text-ink mb-1 uppercase tracking-wider/g, 'text-[10px] leading-[12.8px] font-semibold text-ink mb-1 uppercase tracking-wider');
  
  // Inputs
  code = code.replace(/className="w-full border border-ink-faint bg-bg-base rounded-lg px-4 py-2 focus:ring-2 focus:ring-ink outline-none transition-shadow"/g, 'className="w-full border border-ink-faint bg-bg-base rounded-[12px] pt-[6px] pb-[7px] text-[14px] leading-[14px] px-3 focus:ring-2 focus:ring-ink outline-none transition-shadow"');
  code = code.replace(/className="w-full border border-ink-faint rounded-lg px-4 py-2 focus:ring-2 focus:ring-ink outline-none transition-shadow font-mono text-sm"/g, 'className="w-full border border-ink-faint rounded-[12px] pt-[6px] pb-[7px] text-[14px] leading-[14px] px-3 focus:ring-2 focus:ring-ink outline-none transition-shadow font-mono"');

  // Buttons in Profile Modal
  code = code.replace(/className="w-full bg-ink text-white font-medium rounded-lg px-4 py-3 hover:bg-ink\/90 transition-colors mt-2"/g, 'className="w-full h-[30px] leading-[11px] bg-ink text-white rounded-full font-medium text-sm hover:opacity-90 transition-colors mt-2"');
  code = code.replace(/className="text-ink text-sm font-medium flex items-center justify-center gap-2 w-full hover:bg-black\/5 py-2 rounded-lg transition-colors"/g, 'className="w-full h-[30px] leading-[11px] text-ink font-medium rounded-full text-sm hover:bg-black/5 transition-colors flex items-center justify-center gap-2 mt-2"');

  // Buttons in Settings Modal
  code = code.replace(/className="bg-ink text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-ink\/90 transition-colors"/g, 'className="bg-ink text-white px-[20px] h-[30px] leading-[11px] rounded-full font-medium text-sm hover:bg-ink/90 transition-colors"');
  code = code.replace(/className="bg-white border border-ink-faint text-ink px-4 py-2 rounded-full font-medium text-sm hover:bg-black\/5 transition-colors"/g, 'className="bg-white border border-ink-faint text-ink px-[20px] h-[30px] leading-[11px] rounded-full font-medium text-sm hover:bg-black/5 transition-colors"');

  // Padding
  code = code.replace(/p-6/g, 'p-5');

  fs.writeFileSync(file, code);
}
