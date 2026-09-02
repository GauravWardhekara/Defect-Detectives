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
      <div className="bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-ink-faint w-full max-w-sm overflow-hidden flex flex-col" style={{ borderWidth: '0.8px' }}>
        <div 
          className="flex items-center justify-between px-5 border-b border-ink-faint shrink-0 bg-bg-base"
          style={{ height: '50px' }}
        >
          <h2 className="text-[16px] font-bold tracking-tight text-ink flex items-center gap-2">
            <User className="w-5 h-5 text-ink" />
            My Profile
          </h2>
          <button onClick={onClose} className="p-2 text-ink-muted hover:text-ink hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] leading-[12.8px] font-semibold text-ink mb-1 uppercase tracking-wider">Display Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-ink-faint bg-bg-base rounded-[12px] pt-[6px] pb-[7px] text-[14px] leading-[14px] px-3 focus:ring-2 focus:ring-ink outline-none transition-shadow" style={{ borderWidth: '0.8px' }}
              />
            </div>
            <div>
              <label className="block text-[10px] leading-[12.8px] font-semibold text-ink mb-1 uppercase tracking-wider">Department</label>
              <input
                type="text"
                value={editDept}
                onChange={(e) => setEditDept(e.target.value)}
                className="w-full border border-ink-faint bg-bg-base rounded-[12px] pt-[6px] pb-[7px] text-[14px] leading-[14px] px-3 focus:ring-2 focus:ring-ink outline-none transition-shadow" style={{ borderWidth: '0.8px' }}
              />
            </div>
            
            <div className="border-t border-ink-faint flex items-center justify-center gap-3" style={{ marginTop: '2px', paddingTop: '23px', paddingBottom: '23px' }}>
              <button 
                onClick={handleUpdateProfile} 
                className="bg-ink text-white text-[10px] font-medium rounded-full hover:opacity-90 transition-colors flex items-center justify-center"
                style={{ height: '29.5875px', width: '110.788px', lineHeight: '8px', borderWidth: '0.8px' }}
              >
                Save Profile
              </button>
              <button 
                onClick={handleDownload} 
                className="bg-white border border-ink-faint bg-bg-base text-slate-700 text-[10px] font-medium rounded-full flex items-center justify-center gap-1 hover:bg-slate-50 transition-colors"
                style={{ height: '29.5875px', width: '110.788px', lineHeight: '8px', borderWidth: '0.8px' }}
              >
                <Download className="w-3 h-3" />
                Download Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
