const fs = require('fs');
let code = fs.readFileSync('src/components/DefectFormModal.tsx', 'utf8');

if (!code.includes('handleAddNewPlatform')) {
  // Add platforms to useAppContext
  code = code.replace(
    'addProject, addUser, networkConfig, aiConfig, filterProject } = useAppContext();',
    'addProject, addUser, networkConfig, aiConfig, filterProject, platforms, addPlatform } = useAppContext();'
  );

  // Add handleAddNewPlatform
  const handleAddNewProject = `  const handleAddNewProject = () => {
    const newProj = prompt('Enter new project name:');
    if (newProj && newProj.trim() && !projects.find(p => p.name === newProj.trim())) {
      addProject(newProj.trim());
      setFormData(prev => ({ ...prev, project: newProj.trim() }));
    }
  };`;

  const handleAddNewPlatform = `
  const handleAddNewPlatform = () => {
    const newPlat = prompt('Enter new platform name:');
    if (newPlat && newPlat.trim() && !platforms.find(p => p.name === newPlat.trim())) {
      addPlatform(newPlat.trim());
      const newPlats = formData.platforms ? [...formData.platforms, newPlat.trim()] : [newPlat.trim()];
      setFormData(prev => ({ ...prev, platforms: newPlats }));
    }
  };

  const togglePlatform = (platName: string) => {
    setFormData(prev => {
      const current = prev.platforms || [];
      if (current.includes(platName)) {
        return { ...prev, platforms: current.filter(p => p !== platName) };
      } else {
        return { ...prev, platforms: [...current, platName] };
      }
    });
  };`;
  
  code = code.replace(handleAddNewProject, handleAddNewProject + handleAddNewPlatform);
  
  const formDataProject = `      project: filterProject !== 'All' ? filterProject : (projects[0]?.name || ''),`;
  code = code.replace(
    formDataProject,
    `      project: filterProject !== 'All' ? filterProject : (projects[0]?.name || ''),
      platforms: [],`
  );

  const projectField = `              <div>
                <label className="block text-sm font-medium text-ink mb-1">Project</label>
                <div className="flex gap-2">
                  <select name="project" value={formData.project} onChange={handleChange} className="flex-1 px-4 py-2 border border-ink-faint bg-bg-base rounded-[16px]">
                    {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                  <button type="button" onClick={handleAddNewProject} className="p-2 border border-ink-faint bg-bg-base rounded-[16px] text-ink-muted hover:bg-black/5" title="Add New Project">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>`;

  const platformsField = `
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Platforms</label>
                <div className="flex flex-wrap gap-2 items-center">
                  {platforms.map(p => {
                    const isSelected = formData.platforms?.includes(p.name);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePlatform(p.name)}
                        className={\`px-3 py-1 text-[12px] font-medium rounded-full border transition-colors \${
                          isSelected 
                            ? 'bg-ink text-white border-ink' 
                            : 'bg-bg-base text-ink border-ink-faint hover:bg-black/5'
                        }\`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                  <button type="button" onClick={handleAddNewPlatform} className="p-1 px-3 border border-dashed border-ink-muted text-ink-muted bg-bg-base rounded-full hover:bg-black/5 text-[12px] flex items-center gap-1" title="Add New Platform">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>`;
              
  code = code.replace(projectField, projectField + platformsField);

  fs.writeFileSync('src/components/DefectFormModal.tsx', code);
}
