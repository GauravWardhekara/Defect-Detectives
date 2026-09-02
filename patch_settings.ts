import fs from 'fs';
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf-8');

const target = `            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-slate-500" />
              Workspace Projects ({projects.length})
            </h3>`;
const blockStart = content.indexOf(target);
if (blockStart !== -1) {
  const blockEnd = content.indexOf(`          </div>`, blockStart);
  content = content.substring(0, blockStart) + content.substring(blockEnd);
}

fs.writeFileSync('src/components/SettingsModal.tsx', content);
