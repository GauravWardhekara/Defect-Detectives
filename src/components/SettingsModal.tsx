import React from 'react';
import { X, Save, Key } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" />
            Settings
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
              <h3 className="font-bold mb-1">AI Integrated Successfully</h3>
              <p className="text-sm">
                Your application is now using the integrated Gemini AI provided by the platform. 
                Your Google Sign-In is automatically used to securely authenticate and authorize all AI requests. 
                No local API keys are required.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
