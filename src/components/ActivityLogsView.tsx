import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Activity, Clock } from 'lucide-react';

export const ActivityLogsView = () => {
  const { auditTrail, users } = useAppContext();

  // Sort latest first
  const sortedLogs = [...auditTrail].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="flex flex-col w-full">
      <div className="h-[55.8px] px-8 border-b border-ink-faint shrink-0 flex items-center gap-3">
        <Activity className="w-4 h-4 text-ink" />
        <h2 className="font-sans text-[16px] font-bold tracking-tight text-ink">Activity Logs</h2>
      </div>
      
      <div className="w-full p-10">
        {sortedLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-ink-muted gap-3">
            <Clock className="w-[42px] h-[42px]" />
            <p className="text-xs">No activity recorded yet.</p>
          </div>
        ) : (
          <div className="relative border-l border-ink-faint ml-4 space-y-8 pb-4">
            {sortedLogs.map((log, i) => {
              const date = new Date(log.timestamp);
              return (
                <div key={log.id} className="relative pl-6">
                  {/* Timeline dot */}
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-ink rounded-full border-2 border-white shadow-sm" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                    <span className="font-semibold text-ink text-sm">{log.user}</span>
                    <span className="text-xs text-ink-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {date.toLocaleDateString()} {date.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-ink font-medium bg-bg-base border border-ink-faint rounded-[16px] p-4 mt-2 max-w-2xl">
                    <span className="font-medium text-ink font-mono uppercase text-xs mr-2">{log.action}:</span>
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
