import { User } from '../types';

const PROFILE_SECRET = import.meta.env.VITE_PROFILE_SECRET || 'defect-diary-secure-profile-v1';

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(PROFILE_SECRET),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("defect-diary-salt"),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export const generateProfileCard = async (user: User) => {
  const key = await getKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(JSON.stringify(user))
  );

  const payload = new Uint8Array(iv.length + encrypted.byteLength);
  payload.set(iv, 0);
  payload.set(new Uint8Array(encrypted), iv.length);
  const encryptedStr = arrayBufferToBase64(payload.buffer);
  
  const blob = new Blob([encryptedStr], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${user.name.replace(/\s+/g, '_')}.ddprofile`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const parseProfileCard = async (fileContent: string): Promise<User | null> => {
  try {
    const key = await getKey();
    const payload = new Uint8Array(base64ToArrayBuffer(fileContent));
    const iv = payload.slice(0, 12);
    const data = payload.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );

    const dec = new TextDecoder();
    const userStr = dec.decode(decrypted);
    const user = JSON.parse(userStr);

    if (user && user.id && user.name) {
      return user as User;
    }
    return null;
  } catch (error) {
    console.error("Failed to parse profile card", error);
    return null;
  }
};
