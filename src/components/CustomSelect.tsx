import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  popupClassName?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder, className, popupClassName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div 
        className="flex items-center justify-between w-full h-full cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder || 'Select...'}</span>
        <ChevronDown className="w-3 h-3 ml-2 shrink-0 opacity-50" />
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 top-[calc(100%+4px)] left-0 min-w-full w-max bg-white border border-ink-faint rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${popupClassName || ''}`}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-3 py-1.5 text-xs cursor-pointer hover:bg-black/5 transition-colors ${value === option.value ? 'bg-black/5 font-medium' : 'text-ink'}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
