import React from 'react';
import { Loader2 } from 'lucide-react';

export const ImportProgressModal = ({ current, total }: { current: number, total: number }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-ink-faint shadow-2xl flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-ink animate-spin mb-4" />
        <h2 className="text-xl font-bold font-sans tracking-tight mb-2 text-ink">Importing Issues</h2>
        <p className="text-sm font-medium text-ink-muted mb-6">
          {current} of {total} imported...
        </p>
        <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden border border-slate-200">
          <div 
            className="bg-ink h-full transition-all duration-300 ease-out" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs font-mono font-medium text-ink-muted w-full text-right">{percentage}%</p>
      </div>
    </div>
  );
};
