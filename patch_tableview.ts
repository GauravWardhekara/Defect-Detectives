import fs from 'fs';

let content = fs.readFileSync('src/components/TableView.tsx', 'utf-8');
const target = `<div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-slate-700">Active Defects</div>
          <div className="flex items-center gap-2">
            <select className="text-xs border border-slate-200 rounded p-1 bg-white text-slate-600 focus:outline-none">
              <option>All Projects</option>
            </select>
          </div>
        </div>`;
const replacement = `<div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-slate-700">Active Defects</div>
        </div>`;
content = content.replace(target, replacement);
fs.writeFileSync('src/components/TableView.tsx', content);
