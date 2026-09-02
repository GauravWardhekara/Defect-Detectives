const fs = require('fs');

let tv = fs.readFileSync('src/components/TableView.tsx', 'utf8');

// Add import
if (!tv.includes('CustomSelect')) {
  tv = tv.replace(/import \{ useAppContext \}.*?;/, "import { useAppContext } from '../context/AppContext';\nimport { CustomSelect } from './CustomSelect';");
}

tv = tv.replace(
  /<select\s+value=\{bulkStatus\}\s+onChange=\{\(e\) => setBulkStatus\(e\.target\.value as Status\)\}\s+className="text-xs border border-ink-faint rounded-full px-3 py-1\.5 bg-white focus:outline-none text-ink"\s*>\s*<option value="">Update Status\.\.\.<\/option>\s*\{Object\.values\(Status\)\.map\(s => <option key=\{s\} value=\{s\}>\{s\}<\/option>\)\}\s*<\/select>/g,
  `<CustomSelect 
              value={bulkStatus}
              onChange={(val) => setBulkStatus(val as Status)}
              options={[{value: '', label: 'Update Status...'}, ...Object.values(Status).map(s => ({value: s, label: s}))]}
              className="text-xs border border-ink-faint rounded-full px-3 py-1.5 bg-white text-ink min-w-[130px]"
            />`
);

tv = tv.replace(
  /<select\s+value=\{bulkPriority\}\s+onChange=\{\(e\) => setBulkPriority\(e\.target\.value as Priority\)\}\s+className="text-xs border border-ink-faint rounded-full px-3 py-1\.5 bg-white focus:outline-none text-ink"\s*>\s*<option value="">Update Priority\.\.\.<\/option>\s*\{Object\.values\(Priority\)\.map\(p => <option key=\{p\} value=\{p\}>\{p\}<\/option>\)\}\s*<\/select>/g,
  `<CustomSelect 
              value={bulkPriority}
              onChange={(val) => setBulkPriority(val as Priority)}
              options={[{value: '', label: 'Update Priority...'}, ...Object.values(Priority).map(p => ({value: p, label: p}))]}
              className="text-xs border border-ink-faint rounded-full px-3 py-1.5 bg-white text-ink min-w-[130px]"
            />`
);

tv = tv.replace(
  /<select\s+value=\{bulkAssignee\}\s+onChange=\{\(e\) => setBulkAssignee\(e\.target\.value\)\}\s+className="text-xs border border-ink-faint rounded-full px-3 py-1\.5 bg-white focus:outline-none text-ink"\s*>\s*<option value="">Assign To\.\.\.<\/option>\s*\{users\.map\(u => <option key=\{u\.id\} value=\{u\.name\}>\{u\.name\}<\/option>\)\}\s*<\/select>/g,
  `<CustomSelect 
              value={bulkAssignee}
              onChange={(val) => setBulkAssignee(val)}
              options={[{value: '', label: 'Assign To...'}, ...users.map(u => ({value: u.name, label: u.name}))]}
              className="text-xs border border-ink-faint rounded-full px-3 py-1.5 bg-white text-ink min-w-[110px]"
            />`
);

tv = tv.replace(
  /<select\s+value=\{bulkProject\}\s+onChange=\{\(e\) => setBulkProject\(e\.target\.value\)\}\s+className="text-xs border border-ink-faint rounded-full px-3 py-1\.5 bg-white focus:outline-none text-ink"\s*>\s*<option value="">Move to Project\.\.\.<\/option>\s*\{projects\.map\(p => <option key=\{p\.id\} value=\{p\.name\}>\{p\.name\}<\/option>\)\}\s*<\/select>/g,
  `<CustomSelect 
              value={bulkProject}
              onChange={(val) => setBulkProject(val)}
              options={[{value: '', label: 'Move to Project...'}, ...projects.map(p => ({value: p.name, label: p.name}))]}
              className="text-xs border border-ink-faint rounded-full px-3 py-1.5 bg-white text-ink min-w-[140px]"
            />`
);

tv = tv.replace(
  /<select\s+value=\{sortBy\}\s+onChange=\{\(e\) => setSortBy\(e\.target\.value\)\}\s+className="text-xs border border-ink-faint rounded-full px-3 py-1\.5 bg-white focus:outline-none focus:ring-2 focus:ring-ink text-ink"\s*>\s*<option value="updatedAt">Last Updated<\/option>\s*<option value="createdAt">Created Date<\/option>\s*<option value="priority">Priority<\/option>\s*<option value="severity">Severity<\/option>\s*<\/select>/g,
  `<CustomSelect 
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              options={[
                {value: 'updatedAt', label: 'Last Updated'},
                {value: 'createdAt', label: 'Created Date'},
                {value: 'priority', label: 'Priority'},
                {value: 'severity', label: 'Severity'}
              ]}
              className="text-xs border border-ink-faint rounded-full px-3 py-1.5 bg-white text-ink min-w-[120px]"
            />`
);

fs.writeFileSync('src/components/TableView.tsx', tv);

let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes('CustomSelect')) {
  app = app.replace(/import \{ AppProvider.*?;/, "import { AppProvider, useAppContext } from './context/AppContext';\nimport { CustomSelect } from './components/CustomSelect';");
}
app = app.replace(
  /<select\s+value=\{filterProject\}\s+onChange=\{e => setFilterProject\(e\.target\.value\)\}\s+className="px-4 py-1\.5 rounded-full border border-ink bg-transparent font-medium text-xs cursor-pointer hover:bg-black\/5 outline-none"\s*>\s*<option value="All">Projects \(All\)<\/option>\s*\{projects\.map\(p => <option key=\{p\.id\} value=\{p\.name\}>\{p\.name\}<\/option>\)\}\s*<\/select>/g,
  `<CustomSelect 
             value={filterProject} 
             onChange={val => setFilterProject(val)} 
             options={[{value: 'All', label: 'Projects (All)'}, ...projects.map(p => ({value: p.name, label: p.name}))]}
             className="px-4 py-1.5 rounded-full border border-ink bg-transparent font-medium text-xs cursor-pointer hover:bg-black/5 outline-none min-w-[140px]"
          />`
);

app = app.replace(
  /<select\s+value=\{filterStatus\}\s+onChange=\{e => setFilterStatus\(e\.target\.value\)\}\s+className="px-4 py-1\.5 rounded-full border border-ink bg-transparent font-medium text-xs cursor-pointer hover:bg-black\/5 outline-none"\s*>\s*<option value="All">Status \(All\)<\/option>\s*\{Object\.values\(Status\)\.map\(s => <option key=\{s\} value=\{s\}>\{s\}<\/option>\)\}\s*<\/select>/g,
  `<CustomSelect 
             value={filterStatus} 
             onChange={val => setFilterStatus(val)} 
             options={[{value: 'All', label: 'Status (All)'}, ...Object.values(Status).map(s => ({value: s, label: s}))]}
             className="px-4 py-1.5 rounded-full border border-ink bg-transparent font-medium text-xs cursor-pointer hover:bg-black/5 outline-none min-w-[130px]"
          />`
);

fs.writeFileSync('src/App.tsx', app);
