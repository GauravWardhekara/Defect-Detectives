import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PriorityBadge, SeverityBadge, StatusBadge } from './Badges';
import { Defect, Status, Priority, Severity } from '../types';

export const TableView = ({ onRowClick }: { onRowClick: (defect: Defect) => void }) => {
  const { filteredDefects: globalDefects, users, bulkUpdateDefects } = useAppContext();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<Status | ''>('');
  const [bulkPriority, setBulkPriority] = useState<Priority | ''>('');
  const [bulkAssignee, setBulkAssignee] = useState<string>('');
  
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
    
    if (Object.keys(updates).length > 0) {
      bulkUpdateDefects(selectedIds, updates);
      setSelectedIds([]);
      setBulkStatus('');
      setBulkPriority('');
      setBulkAssignee('');
    }
  };

  return (
    <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50/50 gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-slate-700">Active Defects</div>
          <div className="flex items-center gap-2">
            <select className="text-xs border border-slate-200 rounded p-1 bg-white text-slate-600 focus:outline-none">
              <option>All Projects</option>
            </select>
          </div>
        </div>
        
        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg w-full sm:w-auto">
            <span className="text-xs font-semibold text-indigo-700 mr-2">{selectedIds.length} selected</span>
            <select 
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as Status)}
              className="text-xs border border-slate-200 rounded p-1 bg-white focus:outline-none text-slate-600"
            >
              <option value="">Update Status...</option>
              {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select 
              value={bulkPriority}
              onChange={(e) => setBulkPriority(e.target.value as Priority)}
              className="text-xs border border-slate-200 rounded p-1 bg-white focus:outline-none text-slate-600"
            >
              <option value="">Update Priority...</option>
              {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select 
              value={bulkAssignee}
              onChange={(e) => setBulkAssignee(e.target.value)}
              className="text-xs border border-slate-200 rounded p-1 bg-white focus:outline-none text-slate-600"
            >
              <option value="">Assign To...</option>
              {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
            </select>
            <button 
              onClick={handleBulkUpdate}
              disabled={!bulkStatus && !bulkPriority && !bulkAssignee}
              className="text-xs bg-indigo-600 text-white px-3 py-1 rounded font-medium disabled:opacity-50 transition-opacity"
            >
              Apply
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600"
            >
              <option value="updatedAt">Last Updated</option>
              <option value="createdAt">Created Date</option>
              <option value="priority">Priority</option>
              <option value="severity">Severity</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white hover:bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 flex items-center justify-center w-8 h-[30px]"
              title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 bg-white border-b border-slate-200 z-10">
            <tr>
              <th className="px-6 py-3 w-10 text-center">
                <input 
                  type="checkbox" 
                  checked={filteredDefects.length > 0 && selectedIds.length === filteredDefects.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Issue & Description</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Severity / Priority</th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDefects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500 text-sm">
                  No defects found. Create one to get started.
                </td>
              </tr>
            ) : filteredDefects.map((defect) => (
              <tr 
                key={defect.id} 
                onClick={() => onRowClick(defect)}
                className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedIds.includes(defect.id) ? 'bg-indigo-50/30' : ''}`}
              >
                <td className="px-6 py-4 w-10 text-center" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox"
                    checked={selectedIds.includes(defect.id)}
                    onChange={(e) => toggleSelect(defect.id, e as any)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">{defect.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-800">{defect.title}</div>
                  <div className="text-xs text-slate-400 truncate w-48 mt-0.5">{defect.reportedVersion ? `Reported in: ${defect.reportedVersion}` : 'No version specified'}</div>
                  {defect.comments && (
                    <div className="text-[10px] text-slate-400 truncate w-48 mt-1 italic">💭 {defect.comments}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase truncate max-w-[120px] inline-block">{defect.project}</span>
                  {defect.module && (
                    <div className="text-[10px] text-slate-400 mt-1 font-medium">{defect.module}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={defect.status} />
                </td>
                <td className="px-6 py-4 flex flex-col items-start gap-1">
                  <SeverityBadge severity={defect.severity} />
                  <PriorityBadge priority={defect.priority} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                      {defect.assignee.charAt(0)}
                    </div>
                    <span className="text-xs text-slate-600 truncate max-w-[100px]">{defect.assignee}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/30 shrink-0">
        <div>Showing {filteredDefects.length} active issue{filteredDefects.length !== 1 ? 's' : ''}</div>
        <div className="flex gap-1">
          <button className="px-2 py-1 border border-slate-200 rounded hover:bg-white text-slate-600 font-medium">1</button>
        </div>
      </div>
    </div>
  );
};
