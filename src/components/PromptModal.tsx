import React, { useState, useEffect, useRef } from 'react';

interface PromptModalProps {
  isOpen: boolean;
  title: string;
  placeholder?: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

export const PromptModal = ({ isOpen, title, placeholder, onClose, onSubmit }: PromptModalProps) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h3 className="text-lg font-bold text-ink mb-4">{title}</h3>
          <input
            ref={inputRef}
            type="text"
            className="w-full px-4 py-2 border border-ink-faint rounded-xl bg-bg-base focus:ring-2 focus:ring-ink focus:border-ink focus:outline-none"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSubmit(value);
              }
            }}
          />
        </div>
        <div className="px-6 py-4 bg-bg-base border-t border-ink-faint flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(value)}
            className="px-4 py-2 text-sm font-semibold bg-ink text-white rounded-xl hover:bg-ink/90 transition-colors shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
