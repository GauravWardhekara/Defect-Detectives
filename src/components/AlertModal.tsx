import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface AlertModalProps {
  message: string;
  onClose: () => void;
}

export const AlertModal = ({ message, onClose }: AlertModalProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-ink-faint w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-5 border-b border-ink-faint shrink-0 bg-bg-base" style={{ height: '50px' }}>
          <h2 className="text-[14px] font-bold tracking-tight text-ink flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-ink" />
            Alert
          </h2>
          <button onClick={onClose} className="p-2 text-ink-muted hover:text-ink hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <p className="text-[12px] text-ink leading-relaxed">{message}</p>
        </div>
        
        <div className="border-t border-ink-faint flex items-center justify-center gap-3" style={{ marginTop: '2px', paddingTop: '15px', paddingBottom: '15px' }}>
          <button 
            onClick={onClose} 
            className="bg-ink text-white text-[10px] font-medium rounded-full hover:opacity-90 transition-colors flex items-center justify-center"
            style={{ height: '29.5875px', width: '110.788px', lineHeight: '8px' }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
