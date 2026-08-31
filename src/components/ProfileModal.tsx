import React, { useState } from 'react';
import { X, Download, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { generateProfileCard } from '../lib/profile';

export const ProfileModal = ({ onClose }: { onClose: () => void }) => {
  const { currentUser, saveProfile } = useAppContext();
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editDept, setEditDept] = useState(currentUser?.department || '');

  const handleUpdateProfile = () => {
    if (editName && editDept) {
      saveProfile(editName, editDept);
      alert('Profile updated and saved locally!');
      onClose();
    }
  };

  const handleDownload = () => {
    if (currentUser) generateProfileCard(currentUser);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            My Profile
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={editDept}
                onChange={(e) => setEditDept(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
              />
            </div>
            
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
              <button onClick={handleUpdateProfile} className="w-full bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
                Save Profile
              </button>
              <button onClick={handleDownload} className="w-full bg-white border border-slate-200 text-slate-700 text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                Download Profile Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
