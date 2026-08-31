import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Link as LinkIcon, Loader2, FolderSearch } from 'lucide-react';
import { initGoogleAuth, createSpreadsheet, loadGooglePicker } from '../lib/googleSheets';
import { useAppContext } from '../context/AppContext';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [sheetIdInput, setSheetIdInput] = useState('');
  const [error, setError] = useState('');
  
  const { setCurrentUser, setIsAuthenticated, setSpreadsheetId } = useAppContext();

  const handleAuth = (onAuthSuccess: (token: string) => void) => {
    setIsLoading(true);
    setError('');
    
    try {
      const client = initGoogleAuth(
        (token) => {
          setIsAuthenticated(true);
          // Set a mock user since we aren't pulling profile info right now to keep scopes minimal
          setCurrentUser({
            id: '1',
            name: 'QA Engineer',
            email: 'qa@team.local',
            department: 'Quality Assurance'
          });
          onAuthSuccess(token);
        },
        () => {
          setIsLoading(false);
          setIsLinking(false);
          setIsBrowsing(false);
          setError('Google Authentication failed or was cancelled.');
        }
      );
      client.requestAccessToken();
    } catch (err) {
      setIsLoading(false);
      setIsLinking(false);
      setIsBrowsing(false);
      setError('Could not initialize Google Authentication.');
    }
  };

  const handleCreateNewSheet = () => {
    handleAuth(async (token) => {
      try {
        const sheet = await createSpreadsheet(token, `Defect Diary - ${new Date().toISOString().split('T')[0]}`);
        setSpreadsheetId(sheet.spreadsheetId);
        onLoginSuccess(token);
      } catch (err) {
        setError('Failed to create new spreadsheet.');
        setIsLoading(false);
      }
    });
  };

  const handleLinkSheet = () => {
    if (!sheetIdInput.trim()) {
      setError('Please enter a valid URL or ID');
      setIsLinking(false);
      return;
    }

    let extractedId = sheetIdInput.trim();
    if (extractedId.includes('/d/')) {
      const parts = extractedId.split('/d/');
      if (parts[1]) extractedId = parts[1].split('/')[0];
    }
    
    // Remove query parameters and fragments if any
    extractedId = extractedId.split('?')[0].split('#')[0];

    handleAuth((token) => {
      setSpreadsheetId(extractedId);
      onLoginSuccess(token);
    });
  };

  const handleBrowseDrive = () => {
    setIsBrowsing(true);
    handleAuth((token) => {
      loadGooglePicker(
        token, 
        (spreadsheetId) => {
          setSpreadsheetId(spreadsheetId);
          onLoginSuccess(token);
        },
        () => {
          setIsLoading(false);
          setIsBrowsing(false);
        }
      );
    });
  };

  return (
    <div className="bg-slate-100 flex items-center justify-center p-4 rounded-2xl shadow-xl border border-slate-100">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Defect Diary</h1>
        <p className="text-slate-500 mb-6 text-sm leading-relaxed">
          Log in securely to synchronize your team's defect records with Google Sheets.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-lg text-left font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleCreateNewSheet}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white py-3 px-4 rounded-xl font-medium transition-colors"
          >
            {isLoading && !isLinking && !isBrowsing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Create New Shared Sheet
          </button>
          
          <button
            onClick={handleBrowseDrive}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-indigo-200 hover:bg-indigo-50 disabled:opacity-70 text-indigo-700 py-3 px-4 rounded-xl font-medium transition-colors"
          >
            {isLoading && isBrowsing ? <Loader2 className="w-5 h-5 animate-spin" /> : <FolderSearch className="w-5 h-5" />}
            Browse Google Drive
          </button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-wider font-semibold">Or Paste Link</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Paste Google Sheet URL or ID"
              value={sheetIdInput}
              onChange={(e) => setSheetIdInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <button
              onClick={() => {
                setIsLinking(true);
                handleLinkSheet();
              }}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-70 text-slate-700 py-3 px-4 rounded-xl font-medium transition-colors"
            >
              {isLoading && isLinking ? <Loader2 className="w-5 h-5 animate-spin" /> : <LinkIcon className="w-5 h-5" />}
              Connect Existing Sheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

