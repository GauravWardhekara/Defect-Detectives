const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

// Modals padding
code = code.replace(/p-8 text-center/g, 'p-6 text-center');

// H1 font sizes
code = code.replace(/text-\[21px\]/g, 'text-[16px]');

// p font sizes
code = code.replace(/text-sm leading-relaxed/g, 'text-xs leading-relaxed');

// Labels
code = code.replace(/text-xs font-semibold text-ink mb-1 uppercase tracking-wider/g, 'text-[10px] leading-[12.8px] font-semibold text-ink mb-1 uppercase tracking-wider');

// Inputs (Create profile)
code = code.replace(/className="w-full border border-ink-faint rounded-\[12px\] px-4 py-2 focus:ring-2 focus:ring-ink focus:border-ink outline-none transition-shadow"/g, 'className="w-full border border-ink-faint rounded-[12px] pt-[6px] pb-[7px] text-[14px] leading-[14px] px-3 focus:ring-2 focus:ring-ink focus:border-ink outline-none transition-shadow"');

// Inputs (Manual server url)
code = code.replace(/className="w-full border border-ink-faint rounded-\[12px\] px-3 py-2 text-sm focus:ring-2 focus:ring-ink outline-none"/g, 'className="w-full border border-ink-faint rounded-[12px] pt-[6px] pb-[7px] text-[14px] leading-[14px] px-3 focus:ring-2 focus:ring-ink outline-none"');

// Inputs (Join Workspace code)
code = code.replace(/className="w-full text-center text-2xl font-mono tracking-widest border border-ink-faint rounded-\[12px\] px-4 py-3 focus:ring-2 focus:ring-ink focus:border-ink outline-none transition-shadow uppercase"/g, 'className="w-full text-center text-[16px] leading-[16px] font-mono tracking-widest border border-ink-faint rounded-[12px] pt-[8px] pb-[9px] px-4 focus:ring-2 focus:ring-ink focus:border-ink outline-none transition-shadow uppercase"');

// Main Buttons
code = code.replace(/w-full bg-ink text-white font-medium rounded-\[12px\] px-4 py-3 hover:bg-ink\/90 disabled:opacity-50 transition-colors/g, 'w-full h-[30px] leading-[11px] bg-ink text-white rounded-full font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-colors');
code = code.replace(/w-full mt-4 bg-ink text-white font-medium rounded-\[12px\] px-4 py-3 hover:bg-ink\/90 disabled:opacity-50 transition-colors/g, 'w-full mt-4 h-[30px] leading-[11px] bg-ink text-white rounded-full font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-colors');
code = code.replace(/w-full bg-white border border-ink-faint text-ink font-medium rounded-\[12px\] px-4 py-2\.5 hover:bg-black\/5 transition-colors text-sm flex items-center justify-center gap-2/g, 'w-full h-[30px] leading-[11px] bg-white border border-ink-faint text-ink rounded-full font-medium text-sm hover:bg-black/5 transition-colors flex items-center justify-center gap-2');
code = code.replace(/bg-ink text-white px-4 py-2 rounded-\[12px\] text-sm font-medium hover:bg-ink\/90 whitespace-nowrap/g, 'bg-ink text-white px-[20px] h-[30px] leading-[11px] rounded-full text-sm font-medium hover:bg-ink/90 whitespace-nowrap');

fs.writeFileSync('src/components/Login.tsx', code);
