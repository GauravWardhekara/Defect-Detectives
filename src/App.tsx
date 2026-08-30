/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { DashboardView } from './components/DashboardView';
import { KanbanBoard } from './components/KanbanBoard';
import { TableView } from './components/TableView';
import { DefectFormModal } from './components/DefectFormModal';
import { AppProvider, useAppContext } from './context/AppContext';
import { exportToExcel } from './lib/export';
import { fetchSheetData, updateSheetValues, defectsToRows, rowsToDefects, ensureDefectsSheetExists } from './lib/googleSheets';
import { Defect, AuditEvent } from './types';
import { Plus } from 'lucide-react';

const AppContent = () => {
  const { isAuthenticated, spreadsheetId, defects, setDefects, auditTrail } = useAppContext();
  const [token, setToken] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('kanban');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [selectedDefect, setSelectedDefect] = useState<Defect | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
      await ensureDefectsSheetExists(currentToken, currentSheetId);
      const data = await fetchSheetData(currentToken, currentSheetId, 'Defects!A1:Z');
      const fetchedDefects = rowsToDefects(data.values || []);
      
      if (defects.length === 0 && fetchedDefects.length > 0) {
        setDefects(fetchedDefects);
      } else if (defects.length > 0) {
        const rows = defectsToRows(defects);
        await updateSheetValues(currentToken, currentSheetId, 'Defects!A1:Z', rows);
      }
    } catch (error: any) {
      console.error("Sync failed", error);
      setSyncError(error.message || 'Unknown error occurred during sync');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={setToken} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'kanban': return <KanbanBoard onRowClick={(d) => { setSelectedDefect(d); setIsFormOpen(true); }} />;
      case 'table': return <TableView onRowClick={(d) => { setSelectedDefect(d); setIsFormOpen(true); }} />;
      case 'dashboard': return <DashboardView />;
      default: return <KanbanBoard onRowClick={(d) => { setSelectedDefect(d); setIsFormOpen(true); }} />;
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView} 
      onSync={() => { if (token && spreadsheetId) handleSync(token, spreadsheetId); }}
      onExportExcel={() => exportToExcel(defects, auditTrail)}
      isSyncing={isSyncing}
    >
      {syncError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between shrink-0 mb-2">
          <span><strong>Sync Error:</strong> {syncError}</span>
          <button onClick={() => setSyncError(null)} className="text-red-500 hover:text-red-700 text-lg">&times;</button>
        </div>
      )}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {activeView === 'kanban' ? 'Kanban Board' : activeView === 'table' ? 'Issues Registry' : 'Project Health Overview'}
          </h2>
          <p className="text-sm text-slate-500">Monitoring defects across all enterprise platforms</p>
        </div>
        <div className="flex items-center gap-3">
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
        />
      )}
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
