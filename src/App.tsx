/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Layout } from './components/Layout';
import { NetworkConnect } from './components/Login';
import { DashboardView } from './components/DashboardView';
import { KanbanBoard } from './components/KanbanBoard';
import { TableView } from './components/TableView';
import { DefectFormModal } from './components/DefectFormModal';
import { ActivityLogsView } from './components/ActivityLogsView';
import { SettingsModal } from './components/SettingsModal';
import { ProfileModal } from './components/ProfileModal';
import { Chatbot } from './components/Chatbot';
import { AppProvider, useAppContext } from './context/AppContext';
import { exportToExcel } from './lib/export';
import { rowsToDefects } from './lib/googleSheets'; // Keep for parsing logic, or we can use Papa parse directly
import { Defect } from './types';
import { Plus, Download, Upload } from 'lucide-react';
import Papa from 'papaparse';

const AppContent = () => {
  const { defects, setDefects, auditTrail, networkConfig, socket, authStatus } = useAppContext();
  const [activeView, setActiveView] = useState('dashboard');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(true);
  const [selectedDefect, setSelectedDefect] = useState<Defect | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-close network modal once connected and authenticated
    if (networkConfig && socket && (networkConfig.isMaster || authStatus === 'success')) {
      setTimeout(() => {
        setIsConnectModalOpen(false);
      }, 3000);
    }
  }, [networkConfig, socket, authStatus]);

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
          // Quick manual parsing to match our format
          const rows = results.data as any[][];
          const importedDefects: Defect[] = [];
          
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row[0] || !row[1]) continue; // Skip invalid rows
            
            importedDefects.push({
              id: row[0],
              title: row[1],
              description: row[2] || '',
              project: row[3] || 'General',
              module: row[4] || '',
              priority: row[5] || 'Medium',
              severity: row[6] || 'Minor',
              status: row[7] || 'Open',
              assignee: row[8] || 'Unassigned',
              reporter: row[9] || 'Unknown',
              reportedVersion: row[10] || '',
              targetFixVersion: row[11] || '',
              reproductionSteps: row[12] || '',
              expectedBehavior: row[13] || '',
              actualBehavior: row[14] || '',
              rootCauseAnalysis: row[15] || '',
              resolutionNotes: row[16] || '',
              comments: row[17] || '',
              imageUrl: row[18] || '',
              createdAt: row[19] || new Date().toISOString(),
              updatedAt: row[20] || new Date().toISOString(),
            } as Defect);
          }

          importedDefects.forEach(d => {
            if (socket) {
              socket.emit('add_defect', d);
            }
          });
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
      case 'dashboard': return <DashboardView />;
      case 'activity': return <ActivityLogsView />;
      default: return <KanbanBoard onRowClick={(d) => { setSelectedDefect(d); setIsFormOpen(true); }} />;
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView} 
      onSync={() => {}}
      onExportExcel={() => exportToExcel(defects, auditTrail)}
      onOpenSettings={() => setIsSettingsOpen(true)}
      onOpenConnectModal={() => setIsConnectModalOpen(true)}
      onOpenProfileModal={() => setIsProfileOpen(true)}
      isSyncing={false}
      lastSynced={new Date()}
    >
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
        />
      )}
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
      
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md">
            {/* Close button */}
            {networkConfig && socket && (
              <button 
                onClick={() => setIsConnectModalOpen(false)}
                className="absolute -top-4 -right-4 w-8 h-8 bg-white text-slate-500 hover:text-slate-900 rounded-full shadow-lg flex items-center justify-center transition-colors z-10"
              >
                &times;
              </button>
            )}
            <NetworkConnect />
          </div>
        </div>
      )}
      <Chatbot />
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
