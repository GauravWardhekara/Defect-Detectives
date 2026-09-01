import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, Defect, AuditEvent, User, AIConfig } from '../types';
import Papa from 'papaparse';
import { defaultCsvData } from '../data/defaultCsv';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { generateProfileCard } from '../lib/profile';

interface AppContextType extends AppState {
  setDefects: (defects: Defect[]) => void;
  addDefect: (defect: Defect) => void;
  updateDefect: (defect: Defect) => void;
  bulkUpdateDefects: (ids: string[], updates: Partial<Defect>) => void;
  setAuditTrail: (trail: AuditEvent[]) => void;
  addAuditEvent: (event: AuditEvent) => void;
  setCurrentUser: (user: User | null) => void;
  saveProfile: (name: string, department: string) => void;
  importProfile: (user: User) => void;
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
  aiConfig: AIConfig | null;
  setAiConfig: (config: AIConfig | null) => void;
  filteredDefects: Defect[];
  
  // Network Config
  networkConfig: { isMaster: boolean, masterUrl: string | null, orgCode?: string, inviteCode?: string } | null;
  socket: Socket | null;
  authStatus: 'pending' | 'success' | 'required' | 'failed';
  joinOrg: (code: string) => void;
}

const defaultDefectsData: Defect[] = [];

const defaultState: AppState = {
  defects: defaultDefectsData,
  auditTrail: [],
  users: [],
  projects: ['E-Commerce Web Portal', 'Mobile iOS & Android', 'Payment Gateway', 'Inventory ERP', 'Customer Support Dashboard', 'Analytics Pipeline', 'Marketing Site'],
  currentUser: null,
  aiConfig: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [defects, setDefects] = useState<Defect[]>(defaultState.defects);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>(defaultState.auditTrail);
  const [users, setUsers] = useState<User[]>(defaultState.users);
  const [projects, setProjects] = useState<string[]>(defaultState.projects);
  const [currentUser, setCurrentUser] = useState<User | null>(defaultState.currentUser);
  const [aiConfig, setAiConfigState] = useState<AIConfig | null>(defaultState.aiConfig);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState<string | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<string | 'All'>('All');
  const [geminiApiKey, setGeminiApiKeyState] = useState<string | null>(null);

  const [networkConfig, setNetworkConfig] = useState<{isMaster: boolean, masterUrl: string | null, orgCode?: string, inviteCode?: string} | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [authStatus, setAuthStatus] = useState<'pending' | 'success' | 'required' | 'failed'>('pending');

  const setAiConfig = (config: AIConfig | null) => {
    setAiConfigState(config);
    if (config) localStorage.setItem('defect_tracker_ai_config', JSON.stringify(config));
    else localStorage.removeItem('defect_tracker_ai_config');
  };

  const setGeminiApiKey = (key: string | null) => {
    setGeminiApiKeyState(key);
    if (key) localStorage.setItem('defect_tracker_gemini_api_key', key);
    else localStorage.removeItem('defect_tracker_gemini_api_key');
  };

  const saveProfile = (name: string, department: string) => {
    let profileToSave = currentUser;
    if (!profileToSave) {
      profileToSave = { id: uuidv4(), name, email: `${name.replace(/\s+/g, '').toLowerCase()}@local`, department };
    } else {
      profileToSave = { ...profileToSave, name, department };
    }
    localStorage.setItem('defect_diary_profile', JSON.stringify(profileToSave));
    setCurrentUser(profileToSave);
    
    // Automatically trigger download on new profile creation or update
    generateProfileCard(profileToSave);
  };

  const importProfile = (user: User) => {
    localStorage.setItem('defect_diary_profile', JSON.stringify(user));
    setCurrentUser(user);
  };

  useEffect(() => {
    const savedApiKey = localStorage.getItem('defect_tracker_gemini_api_key');
    if (savedApiKey) {
      setGeminiApiKeyState(savedApiKey);
    }

    const savedAiConfig = localStorage.getItem('defect_tracker_ai_config');
    if (savedAiConfig) {
      try {
        setAiConfigState(JSON.parse(savedAiConfig));
      } catch (e) {
        console.error("Failed to parse AI Config", e);
      }
    }

    const savedProfile = localStorage.getItem('defect_diary_profile');
    let loadedProfile: User | null = null;
    if (savedProfile) {
      loadedProfile = JSON.parse(savedProfile);
      setCurrentUser(loadedProfile);
    }
    
    // Fetch LAN config on boot
    const fetchConfig = () => {
      fetch('/api/config?t=' + Date.now())
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(data => {
          setNetworkConfig(data);
          if (data.masterUrl && loadedProfile) {
            // If we are the master node, connect to the same origin we're served from
            const urlToConnect = data.isMaster ? '/' : data.masterUrl;
            const s = io(urlToConnect);
            
            s.on("connect", () => {
              s.emit("auth", loadedProfile);
            });

            s.on("auth_success", (res: { orgCode: string, users: User[], defects: Defect[] }) => {
              setAuthStatus('success');
              setUsers(res.users);
              setDefects(res.defects);
              setNetworkConfig(prev => prev ? { ...prev, orgCode: res.orgCode } : null);
            });

            s.on("auth_required", () => {
              setAuthStatus('required');
            });

            s.on("auth_failed", (err) => {
              setAuthStatus('failed');
              alert(`Authentication failed: ${err}`);
            });

            s.on("users_updated", (orgUsers: User[]) => {
              setUsers(orgUsers);
            });

            s.on("sync", (syncedDefects: Defect[]) => {
              setDefects(syncedDefects);
            });

            setSocket(s);
          } else if (data.masterUrl && !loadedProfile) {
            // If no profile yet, we just hold off on socket auth
            setAuthStatus('required'); // They need to make profile first
          }
        })
        .catch(err => {
          console.error("Could not fetch network config, retrying in 2s:", err);
          setTimeout(fetchConfig, 2000);
        });
    };
    
    fetchConfig();
      
    return () => {
      if (socket) socket.disconnect();
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    // If we just created a profile, and we have a masterUrl but no socket, we should connect.
    if (networkConfig?.masterUrl && currentUser && !socket) {
      const urlToConnect = networkConfig.isMaster ? '/' : networkConfig.masterUrl;
      const s = io(urlToConnect);
      
      s.on("connect", () => {
        s.emit("auth", currentUser);
      });

      s.on("auth_success", (res: { orgCode: string, users: User[], defects: Defect[] }) => {
        setAuthStatus('success');
        setUsers(res.users);
        setDefects(res.defects);
        setNetworkConfig(prev => prev ? { ...prev, orgCode: res.orgCode } : null);
      });

      s.on("auth_required", () => {
        setAuthStatus('required');
      });

      s.on("auth_failed", (err) => {
        setAuthStatus('failed');
        alert(`Authentication failed: ${err}`);
      });

      s.on("users_updated", (orgUsers: User[]) => {
        setUsers(orgUsers);
      });

      s.on("sync", (syncedDefects: Defect[]) => {
        setDefects(syncedDefects);
      });

      setSocket(s);
    }
  }, [currentUser, networkConfig?.masterUrl, socket]);

  useEffect(() => {
    // If we have a socket but we just created a profile, trigger auth (if already connected but waiting)
    if (socket && currentUser && authStatus === 'required' && networkConfig?.isMaster) {
        socket.emit("auth", currentUser);
    }
  }, [currentUser, socket, networkConfig, authStatus]);

  const joinOrg = (code: string) => {
    if (socket && currentUser) {
      socket.emit("join_org", { inviteCode: code, profile: currentUser });
    }
  };

  const addDefect = (defect: Defect) => {
    if (socket) socket.emit("add_defect", defect);
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
    if (socket) socket.emit("update_defect", defect);
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
    ids.forEach(id => {
      const defect = defects.find(d => d.id === id);
      if (defect) {
        if (socket) socket.emit("update_defect", { ...defect, ...updates, updatedAt: new Date().toISOString() });
        addAuditEvent({
          id: `audit-${Date.now()}-${id}`,
          defectId: id,
          timestamp: new Date().toISOString(),
          user: currentUser?.name || 'System',
          action: 'Bulk Updated',
          details: `Bulk updated fields: ${Object.keys(updates).join(', ')}`
        });
      }
    });
  };

  const deleteDefect = (id: string) => {
    if (socket) socket.emit("delete_defect", id);
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
    currentUser, setCurrentUser, saveProfile, importProfile,
    searchQuery, setSearchQuery,
    filterProject, setFilterProject,
    filterStatus, setFilterStatus,
    geminiApiKey, setGeminiApiKey,
    aiConfig, setAiConfig,
    filteredDefects,
    networkConfig,
    socket,
    authStatus, joinOrg
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
