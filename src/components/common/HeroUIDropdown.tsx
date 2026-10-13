import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface HeroUIDropdownProps<T extends string = string> {
  value: T;
  options: readonly DropdownOption<T>[] | DropdownOption<T>[];
  onChange: (val: T) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

/**
 * ============================================================================
 * HeroUIDropdown: Dropdown chuẩn phong cách HeroUI & Apple Human Interface
 * Hỗ trợ tự động đảo hướng hiển thị (lên trên hoặc xuống dưới) chống bị cắt trong popup/modal
 * ============================================================================
 */
export const HeroUIDropdown = <T extends string>({
  value,
  options,
  onChange,
  label,
  placeholder = 'Chọn một mục...',
  className = '',
  buttonClassName = '',
  icon,
  disabled = false,
}: HeroUIDropdownProps<T>): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Tính toán hướng mở (lên trên nếu gần đáy màn hình) để không bị kẹt hay cắt chữ
  const toggleDropdown = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 220);
    }
    setIsOpen((prev) => !prev);
  };

  // Xử lý đóng menu khi click ra bên ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Xử lý phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-medium text-zinc-700 mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button - Apple Squircle rounded-xl */}
      <button
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 bg-white text-zinc-900 border border-zinc-200 rounded-xl text-xs sm:text-sm font-medium hover:border-zinc-300 hover:bg-zinc-50/70 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed ${buttonClassName}`}
      >
        <span className="flex items-center gap-2 truncate">
          {icon && <span className="text-zinc-500 shrink-0">{icon}</span>}
          {selectedOption ? (
            <span className="truncate">{selectedOption.label}</span>
          ) : (
            <span className="text-zinc-400 truncate">{placeholder}</span>
          )}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-zinc-800' : ''
          }`}
        />
      </button>

      {/* Floating Popover Menu - Tự động đảo chiều chống bị cắt */}
      {isOpen && (
        <div
          className={`absolute right-0 w-full min-w-[170px] bg-white border border-zinc-200/90 rounded-2xl shadow-xl z-100 p-1.5 animate-in fade-in duration-100 ${
            openUpward
              ? 'bottom-full mb-1.5 origin-bottom-right'
              : 'top-full mt-1.5 origin-top-right'
          }`}
        >
          <div className="max-h-56 overflow-y-auto space-y-0.5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 text-white font-medium'
                      : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {option.icon && (
                      <span className={isSelected ? 'text-white' : 'text-zinc-500'}>
                        {option.icon}
                      </span>
                    )}
                    <span className="truncate">{option.label}</span>
                  </span>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 shrink-0 text-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
