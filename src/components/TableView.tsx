import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CustomSelect } from './CustomSelect';
import { PriorityBadge, SeverityBadge, StatusBadge } from './Badges';
import { Defect, Status, Priority, Severity } from '../types';

export const TableView = ({ onRowClick }: { onRowClick: (defect: Defect) => void }) => {
  const { filteredDefects: globalDefects, users, projects, bulkUpdateDefects } = useAppContext();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<Status | ''>('');
  const [bulkPriority, setBulkPriority] = useState<Priority | ''>('');
  const [bulkAssignee, setBulkAssignee] = useState<string>('');
  const [bulkProject, setBulkProject] = useState<string>('');

  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredDefects = [...globalDefects]
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'priority') {
        const priorityOrder = { [Priority.CRITICAL]: 4, [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'severity') {
        const severityOrder = { [Severity.BLOCKER]: 4, [Severity.MAJOR]: 3, [Severity.MINOR]: 2, [Severity.TRIVIAL]: 1 };
        comparison = severityOrder[a.severity] - severityOrder[b.severity];
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDefects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDefects.map(d => d.id));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkUpdate = () => {
    if (selectedIds.length === 0) return;
    const updates: Partial<Defect> = {};
    if (bulkStatus) updates.status = bulkStatus;
    if (bulkPriority) updates.priority = bulkPriority;
    if (bulkAssignee) updates.assignee = bulkAssignee;
    if (bulkProject) updates.project = bulkProject;
    
    if (Object.keys(updates).length > 0) {
      bulkUpdateDefects(selectedIds, updates);
      setSelectedIds([]);
      setBulkStatus('');
      setBulkPriority('');
      setBulkAssignee('');
      setBulkProject('');
    }
  };

  return (
    <div className="flex-1 bg-white rounded-xl border border-ink-faint shadow-sm flex flex-col overflow-hidden">
      <div className="px-10 py-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/5/50 gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-ink">Active Defects</div>
        </div>
        
        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-[12px] w-full sm:w-auto">
            <span className="text-xs font-semibold text-ink mr-2">{selectedIds.length} selected</span>
            <CustomSelect 
              value={bulkStatus}
              onChange={(val) => setBulkStatus(val as Status)}
              options={[{value: '', label: 'Update Status...'}, ...Object.values(Status).map(s => ({value: s, label: s}))]}
              className="text-xs border border-ink-faint rounded-full px-3 py-1.5 bg-white text-ink min-w-[130px]"
            />
            <CustomSelect 
              value={bulkPriority}
              onChange={(val) => setBulkPriority(val as Priority)}
              options={[{value: '', label: 'Update Priority...'}, ...Object.values(Priority).map(p => ({value: p, label: p}))]}
              className="text-xs border border-ink-faint rounded-full px-3 py-1.5 bg-white text-ink min-w-[130px]"
            />
            <CustomSelect 
              value={bulkAssignee}
              onChange={(val) => setBulkAssignee(val)}
              options={[{value: '', label: 'Assign To...'}, ...users.map(u => ({value: u.name, label: u.name}))]}
              className="text-xs border border-ink-faint rounded-full px-3 py-1.5 bg-white text-ink min-w-[110px]"
            />
            <CustomSelect 
              value={bulkProject}
              onChange={(val) => setBulkProject(val)}
              options={[{value: '', label: 'Move to Project...'}, ...projects.map(p => ({value: p.name, label: p.name}))]}
              className="text-xs border border-ink-faint rounded-full px-3 py-1.5 bg-white text-ink min-w-[140px]"
            />
            <button 
              onClick={handleBulkUpdate}
              disabled={!bulkStatus && !bulkPriority && !bulkAssignee && !bulkProject}
              className="text-xs bg-ink text-white px-3 py-1 rounded font-medium disabled:opacity-50 transition-opacity"
            >
              Apply
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <CustomSelect 
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              options={[
                {value: 'updatedAt', label: 'Last Updated'},
                {value: 'createdAt', label: 'Created Date'},
                {value: 'priority', label: 'Priority'},
                {value: 'severity', label: 'Severity'}
              ]}
              className="text-xs border border-ink-faint rounded-full px-3 py-1.5 bg-white text-ink min-w-[120px]"
            />
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="text-xs border border-ink-faint rounded-full px-3 py-1.5 bg-white hover:bg-black/5 text-ink focus:outline-none focus:ring-2 focus:ring-ink flex items-center justify-center w-8 h-[30px]"
              title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        )}
      </div>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 bg-white border-b border-ink-faint z-10">
            <tr>
              <th className="px-10 py-4 w-10 text-center">
                <input 
                  type="checkbox" 
                  checked={filteredDefects.length > 0 && selectedIds.length === filteredDefects.length}
                  onChange={toggleSelectAll}
                  className="rounded border-ink-faint bg-bg-base text-ink focus:ring-ink"
                />
              </th>
              <th className="px-10 py-4 text-[10px] font-bold text-ink-muted uppercase tracking-wider">ID</th>
              <th className="px-10 py-4 text-[10px] font-bold text-ink-muted uppercase tracking-wider">Issue & Description</th>
              <th className="px-10 py-4 text-[10px] font-bold text-ink-muted uppercase tracking-wider">Project</th>
              <th className="px-10 py-4 text-[10px] font-bold text-ink-muted uppercase tracking-wider">Status</th>
              <th className="px-10 py-4 text-[10px] font-bold text-ink-muted uppercase tracking-wider">Severity / Priority</th>
              <th className="px-10 py-4 text-[10px] font-bold text-ink-muted uppercase tracking-wider">Assignee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDefects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-ink-muted text-sm">
                  No defects found. Create one to get started.
                </td>
              </tr>
            ) : filteredDefects.map((defect) => (
              <tr 
                key={defect.id} 
                onClick={() => onRowClick(defect)}
                className={`hover:bg-black/5 transition-colors cursor-pointer ${selectedIds.includes(defect.id) ? 'bg-black/5' : ''}`}
              >
                <td className="px-10 py-6 w-10 text-center" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox"
                    checked={selectedIds.includes(defect.id)}
                    onChange={(e) => toggleSelect(defect.id, e as any)}
                    className="rounded border-ink-faint bg-bg-base text-ink focus:ring-ink"
                  />
                </td>
                <td className="px-10 py-6 text-xs font-mono text-ink-muted">{defect.id}</td>
                <td className="px-10 py-6 text-[0.95rem]">
                  <div className="text-sm font-medium text-ink">{defect.title}</div>
                  <div className="text-xs text-ink-muted truncate w-48 mt-0.5">{defect.reportedVersion ? `Reported in: ${defect.reportedVersion}` : 'No version specified'}</div>
                  {defect.comments && (
                    <div className="text-[10px] text-ink-muted truncate w-48 mt-1 italic">💭 {defect.comments}</div>
                  )}
                </td>
                <td className="px-10 py-6 text-[0.95rem]">
                  <span className="px-2 py-0.5 bg-bg-base text-ink rounded text-[10px] font-bold uppercase truncate max-w-[120px] inline-block">{defect.project}</span>
                  {defect.module && (
                    <div className="text-[10px] text-ink-muted mt-1 font-medium">{defect.module}</div>
                  )}
                </td>
                <td className="px-10 py-6 text-[0.95rem]">
                  <StatusBadge status={defect.status} />
                </td>
                <td className="px-10 py-6 flex flex-col items-start gap-1">
                  <SeverityBadge severity={defect.severity} />
                  <PriorityBadge priority={defect.priority} />
                </td>
                <td className="px-10 py-6 text-[0.95rem]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-ink shrink-0">
                      {defect.assignee.charAt(0)}
                    </div>
                    <span className="text-xs text-ink truncate max-w-[100px]">{defect.assignee}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-10 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-ink-muted bg-black/5/30 shrink-0">
        <div>Showing {filteredDefects.length} active issue{filteredDefects.length !== 1 ? 's' : ''}</div>
        <div className="flex gap-1">
          <button className="px-2 py-1 border border-ink-faint rounded hover:bg-white text-ink font-medium">1</button>
        </div>
      </div>
    </div>
  );
};
