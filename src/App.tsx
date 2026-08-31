/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { DashboardView } from './components/DashboardView';
import { KanbanBoard } from './components/KanbanBoard';
import { TableView } from './components/TableView';
import { DefectFormModal } from './components/DefectFormModal';
import { ActivityLogsView } from './components/ActivityLogsView';
import { SettingsModal } from './components/SettingsModal';
import { Chatbot } from './components/Chatbot';
import { AppProvider, useAppContext } from './context/AppContext';
import { exportToExcel } from './lib/export';
import { fetchSheetData, updateSheetValues, defectsToRows, rowsToDefects, ensureDefectsSheetExists } from './lib/googleSheets';
import { Defect, AuditEvent } from './types';
import { Plus, Download, Upload } from 'lucide-react';
import Papa from 'papaparse';

const AppContent = () => {
  const { isAuthenticated, spreadsheetId, defects, setDefects, auditTrail, setSpreadsheetTitle } = useAppContext();
  const [token, setToken] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(!isAuthenticated);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [selectedDefect, setSelectedDefect] = useState<Defect | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial sync when token and spreadsheet are available
  useEffect(() => {
    if (token && spreadsheetId && isAuthenticated) {
      handleSync(token, spreadsheetId);
    }
  }, [token, spreadsheetId, isAuthenticated]);

  const handleSync = async (currentToken: string, currentSheetId: string) => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const title = await ensureDefectsSheetExists(currentToken, currentSheetId);
      if (title) setSpreadsheetTitle(title);
      
      const data = await fetchSheetData(currentToken, currentSheetId, 'Defects!A1:Z');
      const fetchedDefects = rowsToDefects(data.values || []);
      
      if (defects.length === 0 && fetchedDefects.length > 0) {
        setDefects(fetchedDefects);
      } else if (defects.length > 0) {
        const rows = defectsToRows(defects);
        await updateSheetValues(currentToken, currentSheetId, 'Defects!A1:Z', rows);
      }
      setLastSynced(new Date());
    } catch (error: any) {
      console.error("Sync failed", error);
      setSyncError(error.message || 'Unknown error occurred during sync');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = [
      ['ID', 'Title', 'Description', 'Project', 'Module', 'Priority', 'Severity', 'Status', 'Assignee', 'Reporter', 'Reported Version', 'Target Fix Version', 'Reproduction Steps', 'Expected Behavior', 'Actual Behavior', 'Root Cause Analysis', 'Resolution Notes', 'Comments', 'Image URL', 'Created At', 'Updated At'],
      ['DEF-123456', 'Sample Defect', 'Description here', 'Project A', 'UI', 'Medium', 'Minor', 'Open', 'John Doe', 'Jane Doe', 'v1.0.0', 'v1.0.1', '1. Go to X', 'Expect Y', 'Got Z', '', '', '', '', new Date().toISOString(), new Date().toISOString()]
    ];
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'defect_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    Papa.parse(file, {
      complete: (results) => {
        if (results.data && results.data.length > 1) {
          const importedDefects = rowsToDefects(results.data as any[][]);
          const newDefects = [...defects];
          importedDefects.forEach(d => {
            if (d.id && !newDefects.find(ex => ex.id === d.id)) {
              newDefects.push(d);
            }
          });
          setDefects(newDefects);
          if (token && spreadsheetId) {
            handleSync(token, spreadsheetId);
          }
        }
      }
    });
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderView = () => {
    switch (activeView) {
      case 'kanban': return <KanbanBoard onRowClick={(d) => { setSelectedDefect(d); setIsFormOpen(true); }} />;
      case 'table': return <TableView onRowClick={(d) => { setSelectedDefect(d); setIsFormOpen(true); }} />;
      case 'dashboard': return <DashboardView token={token} />;
      case 'activity': return <ActivityLogsView />;
      default: return <KanbanBoard onRowClick={(d) => { setSelectedDefect(d); setIsFormOpen(true); }} />;
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView} 
      onSync={() => { if (token && spreadsheetId) handleSync(token, spreadsheetId); }}
      onExportExcel={() => exportToExcel(defects, auditTrail)}
      onOpenSettings={() => setIsSettingsOpen(true)}
      onOpenConnectModal={() => setIsConnectModalOpen(true)}
      isSyncing={isSyncing}
      lastSynced={lastSynced}
    >
      {syncError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between shrink-0 mb-2">
          <span><strong>Sync Error:</strong> {syncError}</span>
          <button onClick={() => setSyncError(null)} className="text-red-500 hover:text-red-700 text-lg">&times;</button>
        </div>
      )}
      <div className="flex items-center justify-between shrink-0 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {activeView === 'kanban' ? 'Kanban Board' : activeView === 'table' ? 'Issues Registry' : activeView === 'activity' ? 'Activity Logs' : 'Project Health Overview'}
          </h2>
          <p className="text-sm text-slate-500">Monitoring defects across all enterprise platforms</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleImportCSV} 
            className="hidden" 
          />
          <button
            onClick={handleDownloadTemplate}
            className="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Template
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={() => exportToExcel(defects, auditTrail)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Export Excel
          </button>
          <button
            onClick={() => { setSelectedDefect(undefined); setIsFormOpen(true); }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            New Defect
          </button>
        </div>
      </div>

      {renderView()}

      {isFormOpen && (
        <DefectFormModal 
          existingDefect={selectedDefect} 
          onClose={() => { setIsFormOpen(false); setSelectedDefect(undefined); }} 
          onAutoSave={() => { if (token && spreadsheetId) handleSync(token, spreadsheetId); }}
          token={token}
        />
      )}
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
      
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md">
            {/* Close button */}
            <button 
              onClick={() => setIsConnectModalOpen(false)}
              className="absolute -top-4 -right-4 w-8 h-8 bg-white text-slate-500 hover:text-slate-900 rounded-full shadow-lg flex items-center justify-center transition-colors z-10"
            >
              &times;
            </button>
            <Login onLoginSuccess={(t) => { 
              setToken(t); 
              setIsConnectModalOpen(false); 
            }} />
          </div>
        </div>
      )}
      <Chatbot token={token} />
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
