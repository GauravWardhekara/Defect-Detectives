import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Activity, Clock } from 'lucide-react';

export const ActivityLogsView = () => {
  const { auditTrail, users } = useAppContext();

  // Sort latest first
  const sortedLogs = [...auditTrail].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200 shrink-0 bg-slate-50 flex items-center gap-3">
        <Activity className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Activity Logs</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {sortedLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
            <Clock className="w-12 h-12" />
            <p>No activity recorded yet.</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-200 ml-4 space-y-8 pb-4">
            {sortedLogs.map((log, i) => {
              const date = new Date(log.timestamp);
              return (
                <div key={log.id} className="relative pl-6">
                  {/* Timeline dot */}
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white shadow-sm" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                    <span className="font-semibold text-slate-800 text-sm">{log.user}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {date.toLocaleDateString()} {date.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3 mt-2 shadow-sm">
                    <span className="font-medium text-indigo-600 mr-2">{log.action}:</span>
                    {log.details}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
