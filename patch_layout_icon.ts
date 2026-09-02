import fs from 'fs';

let content = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

const targetSVG = `<div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>`;

const replaceSVG = `<img src="/icon.png" alt="App Icon" className="w-7 h-7 sm:w-8 sm:h-8 object-cover rounded-lg shrink-0 border border-slate-200" />`;

content = content.replace(targetSVG, replaceSVG);

fs.writeFileSync('src/components/Layout.tsx', content);
