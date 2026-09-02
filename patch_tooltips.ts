import fs from 'fs';

let projContent = fs.readFileSync('src/components/ProjectConfigurationsView.tsx', 'utf-8');

projContent = projContent.replace(
`          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-sans text-[21px] font-bold tracking-tight mb-1">{selectedProject.name}</h3>
              <p className="text-[0.85rem] text-ink-muted leading-[1.4] max-w-[400px]">ID: {selectedProject.id}</p>
            </div>`,
`          <div className="flex items-center justify-between">
            <div className="group relative w-max">
              <h3 className="font-sans text-[21px] font-bold tracking-tight mb-1 cursor-help">{selectedProject.name}</h3>
              <div className="absolute left-0 top-full mt-2 px-3 py-2 bg-ink text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-md z-10 transition-opacity">
                ID: {selectedProject.id}
              </div>
            </div>`
);

projContent = projContent.replace(
`      <div className="p-10 flex justify-between items-start border-b border-ink-faint">
        <div className="max-w-[400px]">
          <h3 className="font-sans text-[21px] font-bold tracking-tight mb-1">Project Configurations</h3>
          <p className="text-[0.85rem] text-ink-muted leading-[1.4]">Monitoring defects across all enterprise platforms. Manage workspace projects and identifiers below.</p>
        </div>`,
`      <div className="p-8 flex justify-between items-start border-b border-ink-faint">
        <div className="group relative w-max">
          <h3 className="font-sans text-[21px] font-bold tracking-tight mb-1 cursor-help">Project Configurations</h3>
          <div className="absolute left-0 top-full mt-2 px-3 py-2 bg-ink text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-md z-10 transition-opacity">
            Monitoring defects across all enterprise platforms. Manage workspace projects and identifiers below.
          </div>
        </div>`
);

fs.writeFileSync('src/components/ProjectConfigurationsView.tsx', projContent);
