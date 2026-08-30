import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, Defect, AuditEvent, User } from '../types';

interface AppContextType extends AppState {
  setDefects: (defects: Defect[]) => void;
  addDefect: (defect: Defect) => void;
  updateDefect: (defect: Defect) => void;
  bulkUpdateDefects: (ids: string[], updates: Partial<Defect>) => void;
  setAuditTrail: (trail: AuditEvent[]) => void;
  addAuditEvent: (event: AuditEvent) => void;
  setCurrentUser: (user: User | null) => void;
  setSpreadsheetId: (id: string | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
  addUser: (user: User) => void;
  addProject: (project: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterProject: string | 'All';
  setFilterProject: (project: string | 'All') => void;
  filterStatus: string | 'All';
  setFilterStatus: (status: string | 'All') => void;
  deleteDefect: (id: string) => void;
  geminiApiKey: string | null;
  setGeminiApiKey: (key: string | null) => void;
  filteredDefects: Defect[];
}

const defaultState: AppState = {
  defects: [],
  auditTrail: [],
  users: [
    { id: '1', name: 'Alice Engineer', email: 'alice@example.com', department: 'Engineering' },
    { id: '2', name: 'Bob QA', email: 'bob@example.com', department: 'Quality Assurance' },
    { id: '3', name: 'Charlie Dev', email: 'charlie@example.com', department: 'Engineering' },
    { id: '4', name: 'Diana UX', email: 'diana@example.com', department: 'Design' },
    { id: '5', name: 'Evan DevOps', email: 'evan@example.com', department: 'Operations' },
    { id: '6', name: 'Fiona PM', email: 'fiona@example.com', department: 'Product' }
  ],
  projects: ['E-Commerce Web Portal', 'Mobile iOS & Android', 'Payment Gateway', 'Inventory ERP', 'Customer Support Dashboard', 'Analytics Pipeline', 'Marketing Site'],
  currentUser: null,
  spreadsheetId: null,
  isAuthenticated: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [defects, setDefects] = useState<Defect[]>(defaultState.defects);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>(defaultState.auditTrail);
  const [users, setUsers] = useState<User[]>(defaultState.users);
  const [projects, setProjects] = useState<string[]>(defaultState.projects);
  const [currentUser, setCurrentUser] = useState<User | null>(defaultState.currentUser);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(defaultState.spreadsheetId);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(defaultState.isAuthenticated);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState<string | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<string | 'All'>('All');
  const [geminiApiKey, setGeminiApiKeyState] = useState<string | null>(null);

  const setGeminiApiKey = (key: string | null) => {
    setGeminiApiKeyState(key);
    if (key) localStorage.setItem('defect_tracker_gemini_api_key', key);
    else localStorage.removeItem('defect_tracker_gemini_api_key');
  };

  // Load from local storage initially
  useEffect(() => {
    const savedSheetId = localStorage.getItem('defect_tracker_sheet_id');
    if (savedSheetId) {
      setSpreadsheetId(savedSheetId);
    }
    const savedApiKey = localStorage.getItem('defect_tracker_gemini_api_key');
    if (savedApiKey) {
      setGeminiApiKeyState(savedApiKey);
    }
  }, []);

  const addDefect = (defect: Defect) => {
    setDefects(prev => [...prev, defect]);
    addAuditEvent({
      id: `audit-${Date.now()}`,
      defectId: defect.id,
      timestamp: new Date().toISOString(),
      user: currentUser?.name || 'System',
      action: 'Created Defect',
      details: `Defect ${defect.id} reported by ${defect.reporter}`
    });
  };
  
  const updateDefect = (defect: Defect) => {
    setDefects(prev => prev.map(d => (d.id === defect.id ? defect : d)));
    addAuditEvent({
      id: `audit-${Date.now()}`,
      defectId: defect.id,
      timestamp: new Date().toISOString(),
      user: currentUser?.name || 'System',
      action: 'Updated Defect',
      details: `Status is ${defect.status}, Priority is ${defect.priority}`
    });
  };

  const bulkUpdateDefects = (ids: string[], updates: Partial<Defect>) => {
    setDefects(prev => prev.map(d => ids.includes(d.id) ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
    ids.forEach(id => {
      addAuditEvent({
        id: `audit-${Date.now()}-${id}`,
        defectId: id,
        timestamp: new Date().toISOString(),
        user: currentUser?.name || 'System',
        action: 'Bulk Updated',
        details: `Bulk updated fields: ${Object.keys(updates).join(', ')}`
      });
    });
  };

  const deleteDefect = (id: string) => {
    setDefects(prev => prev.filter(d => d.id !== id));
    addAuditEvent({
      id: `audit-${Date.now()}-${id}`,
      defectId: id,
      timestamp: new Date().toISOString(),
      user: currentUser?.name || 'System',
      action: 'Deleted Defect',
      details: `Defect ${id} was deleted.`
    });
  };

  const addAuditEvent = (event: AuditEvent) => setAuditTrail(prev => [...prev, event]);
  
  const addUser = (user: User) => setUsers(prev => [...prev, user]);
  const addProject = (project: string) => setProjects(prev => [...prev, project]);

  const filteredDefects = defects.filter(defect => {
    const matchesSearch = 
      !searchQuery || 
      defect.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      defect.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      defect.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = filterProject === 'All' || defect.project === filterProject;
    const matchesStatus = filterStatus === 'All' || defect.status === filterStatus;
    
    return matchesSearch && matchesProject && matchesStatus;
  });

  const value = {
    defects, setDefects, addDefect, updateDefect, bulkUpdateDefects, deleteDefect,
    auditTrail, setAuditTrail, addAuditEvent,
    users, addUser,
    projects, addProject,
    currentUser, setCurrentUser,
    spreadsheetId, setSpreadsheetId: (id: string | null) => {
      setSpreadsheetId(id);
      if (id) localStorage.setItem('defect_tracker_sheet_id', id);
      else localStorage.removeItem('defect_tracker_sheet_id');
    },
    isAuthenticated, setIsAuthenticated,
    searchQuery, setSearchQuery,
    filterProject, setFilterProject,
    filterStatus, setFilterStatus,
    geminiApiKey, setGeminiApiKey,
    filteredDefects
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
