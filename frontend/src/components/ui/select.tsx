import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function Select({ value, onChange, options, disabled, className, placeholder }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={cn("relative w-full", isOpen && "z-50")} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full text-left bg-surface-container border border-white/10 px-3 py-2 rounded-lg text-sm text-on-surface transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          isOpen ? "ring-1 ring-primary/60 border-primary/40 bg-surface-container-high" : "hover:border-white/20 hover:bg-surface-container-high/60",
          className
        )}
      >
        <span className="truncate mr-2 font-medium">{selectedOption?.label || placeholder || 'Select...'}</span>
        <ChevronDown className={cn("w-4 h-4 text-outline transition-transform shrink-0", isOpen && "rotate-180 text-primary")} />
      </button>

      {isOpen && (
        <div 
          role="listbox"
          className="absolute top-full left-0 mt-1.5 w-full min-w-full z-[100] rounded-xl border border-white/15 py-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.85)]"
          style={{
            backgroundColor: '#0b1326',
            opacity: 1
          }}
        >
          <div className="max-h-60 overflow-y-auto overscroll-contain py-0.5">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between w-full text-left px-3.5 py-2.5 text-sm transition-colors cursor-pointer",
                    isSelected 
                      ? "bg-primary/20 text-primary font-semibold" 
                      : "text-slate-200 hover:text-white hover:bg-white/10"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
