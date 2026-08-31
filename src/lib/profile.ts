import CryptoJS from 'crypto-js';
import { User } from '../types';

const PROFILE_SECRET = 'defect-diary-secure-profile-v1';

export const generateProfileCard = (user: User) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(user), PROFILE_SECRET).toString();
  const blob = new Blob([encrypted], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${user.name.replace(/\s+/g, '_')}.ddprofile`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const parseProfileCard = (fileContent: string): User | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(fileContent, PROFILE_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const user = JSON.parse(decrypted);
    if (user && user.id && user.name) {
      return user as User;
    }
    return null;
  } catch (error) {
    console.error("Failed to parse profile card", error);
    return null;
  }
};
