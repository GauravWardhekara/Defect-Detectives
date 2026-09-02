const fs = require('fs');

const file = 'src/components/SettingsModal.tsx';
let code = fs.readFileSync(file, 'utf8');

// Header
code = code.replace(
  /<h2 className="text-\[16px\] font-bold tracking-tight text-ink flex items-center gap-2">/,
  '<h2 className="text-[14px] font-bold tracking-tight text-ink flex items-center gap-2">'
);

// Inner container
code = code.replace(
  /<div className="p-5 overflow-y-auto space-y-8">/,
  '<div className="p-4 overflow-y-auto space-y-5">'
);

// Invite Team Members
code = code.replace(
  /<h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-3">Invite Team Members<\/h3>/,
  '<h3 className="text-[10px] font-bold text-ink uppercase tracking-wider mb-2">Invite Team Members</h3>'
);
code = code.replace(
  /<div className="p-4 bg-bg-base border border-ink-faint rounded-\[16px\] flex items-center justify-between">/,
  '<div className="p-3 bg-bg-base border border-ink-faint rounded-[12px] flex items-center justify-between">'
);
code = code.replace(
  /<div className="text-xs text-ink font-semibold mb-1">WORKSPACE INVITE CODE<\/div>/,
  '<div className="text-[10px] text-ink font-semibold mb-0.5">WORKSPACE INVITE CODE</div>'
);
code = code.replace(
  /<div className="text-2xl font-mono font-bold text-ink tracking-widest">\{networkConfig\.inviteCode\}<\/div>/,
  '<div className="text-lg font-mono font-bold text-ink tracking-widest">{networkConfig.inviteCode}</div>'
);
code = code.replace(
  /<button \s*onClick=\{handleCopy\}\s*className="p-2 bg-white text-ink hover:bg-black\/5 rounded-\[16px\] transition-colors border border-ink-faint shadow-sm"\s*>/,
  '<button \n                  onClick={handleCopy}\n                  className="p-1.5 bg-white text-ink hover:bg-black/5 rounded-[12px] transition-colors border border-ink-faint shadow-sm"\n                >'
);
code = code.replace(
  /\{copied \? <Check className="w-5 h-5 text-green-600" \/> : <Copy className="w-5 h-5" \/>\}/,
  '{copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}'
);

// Remove "Workspace Projects" block entirely
const workspaceProjectsRegex = /<div>\s*<h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-3 flex items-center gap-2">\s*<FolderGit2 className="w-4 h-4 text-ink-muted" \/>\s*Workspace Projects \(\{projects\.length\}\)\s*<\/h3>\s*<div className="border border-ink-faint rounded-\[16px\] bg-bg-base p-4 flex items-center justify-between mb-6">\s*<div className="text-sm text-ink-muted">Manage your projects in the dedicated configuration view\.<\/div>\s*<button \s*onClick=\{\(\) => \{\s*alert\('Navigating to Project Configurations'\);\s*if \(onNavigateToProjects\) onNavigateToProjects\(\);\s*onClose\(\);\s*\}\}\s*className="px-4 py-2 bg-ink text-white rounded font-medium text-xs hover:opacity-90 transition-opacity"\s*>\s*Go to Projects\s*<\/button>\s*<\/div>\s*<\/div>/;

code = code.replace(workspaceProjectsRegex, '');

// Whitelisted Users
code = code.replace(
  /<h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-3 flex items-center gap-2">\s*<Users className="w-4 h-4 text-ink-muted" \/>\s*Whitelisted Users \(\{users\.length\}\)\s*<\/h3>/,
  '<h3 className="text-[10px] font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">\n              <Users className="w-3 h-3 text-ink-muted" />\n              Whitelisted Users ({users.length})\n            </h3>'
);
code = code.replace(
  /<div className="border border-ink-faint rounded-\[16px\] divide-y divide-ink-faint bg-bg-base">/,
  '<div className="border border-ink-faint rounded-[12px] divide-y divide-ink-faint bg-bg-base">'
);
code = code.replace(
  /<div key=\{user\.id\} className="p-3 flex items-center justify-between bg-white first:rounded-t-lg last:rounded-b-lg">/g,
  '<div key={user.id} className="p-2 flex items-center justify-between bg-white first:rounded-t-lg last:rounded-b-lg">'
);
code = code.replace(
  /<div className="w-8 h-8 rounded-full bg-black\/5 flex items-center justify-center text-sm font-bold text-ink border border-ink-faint">/g,
  '<div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold text-ink border border-ink-faint">'
);
code = code.replace(
  /<div className="text-sm font-semibold text-ink">\{user\.name\}<\/div>/g,
  '<div className="text-[11px] font-semibold text-ink">{user.name}</div>'
);
code = code.replace(
  /<div className="text-xs text-ink-muted">\{user\.department\}<\/div>/g,
  '<div className="text-[10px] text-ink-muted">{user.department}</div>'
);
code = code.replace(
  /<div className="p-4 text-sm text-ink-muted text-center">No users registered yet\.<\/div>/,
  '<div className="p-3 text-[11px] text-ink-muted text-center">No users registered yet.</div>'
);

// AI Configuration
code = code.replace(
  /<h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-3 flex items-center gap-2">\s*<Cpu className="w-4 h-4 text-ink-muted" \/>\s*AI Configuration\s*<\/h3>/,
  '<h3 className="text-[10px] font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">\n              <Cpu className="w-3 h-3 text-ink-muted" />\n              AI Configuration\n            </h3>'
);
code = code.replace(
  /<div className="space-y-4">/,
  '<div className="space-y-3">'
);
code = code.replace(
  /<label className="block text-xs font-semibold text-ink mb-1">/g,
  '<label className="block text-[10px] font-semibold text-ink mb-1">'
);
code = code.replace(
  /className="w-full bg-bg-base border border-ink-faint rounded-\[16px\] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink"/g,
  'className="w-full bg-bg-base border border-ink-faint rounded-[12px] px-2.5 py-1.5 text-[11px] focus:outline-none focus:ring-2 focus:ring-ink"'
);
code = code.replace(
  /<button \s*type="button" \s*onClick=\{handleTestConnection\} \s*disabled=\{testStatus === 'testing' \|\| !apiKey\}\s*className="w-full py-2 bg-black\/5 hover:bg-black\/10 text-ink font-medium rounded-\[16px\] text-sm transition-colors border border-ink-faint disabled:opacity-50"\s*>/,
  '<button \n                  type="button" \n                  onClick={handleTestConnection} \n                  disabled={testStatus === \'testing\' || !apiKey}\n                  className="w-full py-1.5 bg-black/5 hover:bg-black/10 text-ink font-medium rounded-[12px] text-xs transition-colors border border-ink-faint disabled:opacity-50"\n                >'
);

// Encryption banner
code = code.replace(
  /<div className="p-4 bg-green-50 text-green-800 rounded-\[16px\] border border-green-200">/,
  '<div className="p-3 bg-green-50 text-green-800 rounded-[12px] border border-green-200">'
);
code = code.replace(
  /<h3 className="font-bold mb-1">Local Encryption Active<\/h3>/,
  '<h3 className="text-[11px] font-bold mb-0.5">Local Encryption Active</h3>'
);

fs.writeFileSync(file, code);

