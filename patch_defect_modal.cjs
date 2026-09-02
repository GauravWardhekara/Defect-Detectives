const fs = require('fs');
let code = fs.readFileSync('src/components/DefectFormModal.tsx', 'utf8');

if (!code.includes("import { AlertModal }")) {
  code = code.replace("import { Defect, Priority, Severity, Status } from '../types';", "import { Defect, Priority, Severity, Status } from '../types';\nimport { AlertModal } from './AlertModal';");
}

code = code.replace("const [isAnalyzing, setIsAnalyzing] = useState(false);", "const [isAnalyzing, setIsAnalyzing] = useState(false);\n  const [alertMessage, setAlertMessage] = useState<string | null>(null);");

code = code.replace(
`      alert("Please enter a title and description first.");`,
`      setAlertMessage("Please enter a title and description first.");`
);

code = code.replace(
`      alert("Failed to analyze defect. Please check your connection and try again.");`,
`      setAlertMessage("Failed to analyze defect. Please check your connection and try again.");`
);

code = code.replace(
`          alert('Camera permission is required to take photos.');`,
`          setAlertMessage('Camera permission is required to take photos.');`
);

const alertModalBlock = `      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-ink-faint w-full max-w-sm overflow-hidden flex flex-col p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Delete Defect?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">This action cannot be undone. Are you sure you want to permanently delete this defect?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="px-4 py-2 text-xs font-medium bg-red-600 text-white hover:bg-red-700 rounded-full transition-colors shadow-sm shadow-red-600/20"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}`;

code = code.replace(
`      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] w-full max-w-sm overflow-hidden flex flex-col p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Delete Defect?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">This action cannot be undone. Are you sure you want to permanently delete this defect?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="px-4 py-2 text-xs font-medium bg-red-600 text-white hover:bg-red-700 rounded-full transition-colors shadow-sm shadow-red-600/20"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}`,
alertModalBlock
);

fs.writeFileSync('src/components/DefectFormModal.tsx', code);
