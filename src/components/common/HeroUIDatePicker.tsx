import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { formatDisplayDate, calculateDateDiffInDays } from '../../utils/dateUtils';

export interface HeroUIDatePickerProps {
  value: string; // Định dạng YYYY-MM-DD
  onChange: (dateStr: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  minDate?: string;
  className?: string;
}

const DAYS_OF_WEEK = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

/**
 * ============================================================================
 * HeroUIDatePicker: DatePicker chuẩn phong cách HeroUI & Apple Human Interface
 * Tự động tính toán hướng mở (lên trên / xuống dưới) chống bị kẹt trong popup/modal
 * ============================================================================
 */
export const HeroUIDatePicker: React.FC<HeroUIDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Chọn hạn nộp...',
  error,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mốc thời gian hôm nay cố định trong lifecycle component
  const [today] = useState(() => new Date());

  // Trạng thái tháng/năm đang được hiển thị trong calendar view
  const [viewDate, setViewDate] = useState(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date();
  });

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Mở popup kèm phát hiện hướng để không bị che khuất
  const toggleOpen = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Nếu phía dưới còn ít hơn 340px thì mở lên phía trên
      setOpenUpward(spaceBelow < 340);

      if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [y, m, d] = value.split('-').map(Number);
        setViewDate(new Date(y, m - 1, d));
      }
    }
    setIsOpen((prev) => !prev);
  };

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Điều hướng tháng
  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Tính toán các ngày trong tháng hiện tại
  const calendarDays = useMemo(() => {
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Chuyển Chủ Nhật (0) thành 6, T2 thành 0
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const result: { dayNumber: number; monthOffset: number; dateString: string }[] = [];

    // Các ngày của tháng trước (lấp đầy tuần đầu tiên)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevDate = new Date(viewYear, viewMonth - 1, d);
      const iso = prevDate.toISOString().split('T')[0];
      result.push({ dayNumber: d, monthOffset: -1, dateString: iso });
    }

    // Các ngày của tháng này
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const currentD = new Date(viewYear, viewMonth, d);
      const yearStr = currentD.getFullYear();
      const monthStr = String(currentD.getMonth() + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const iso = `${yearStr}-${monthStr}-${dayStr}`;
      result.push({ dayNumber: d, monthOffset: 0, dateString: iso });
    }

    // Các ngày của tháng sau để hoàn thiện lưới 35 hoặc 42 ô
    const totalSlots = result.length > 35 ? 42 : 35;
    const remainingSlots = totalSlots - result.length;
    for (let d = 1; d <= remainingSlots; d++) {
      const nextDate = new Date(viewYear, viewMonth + 1, d);
      const iso = nextDate.toISOString().split('T')[0];
      result.push({ dayNumber: d, monthOffset: 1, dateString: iso });
    }

    return result;
  }, [viewYear, viewMonth]);

  // Phím tắt chọn ngày nhanh
  const setQuickDate = (offsetDays: number) => {
    const target = new Date(today);
    target.setDate(target.getDate() + offsetDays);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, '0');
    const d = String(target.getDate()).padStart(2, '0');
    const iso = `${y}-${m}-${d}`;
    onChange(iso);
    setIsOpen(false);
  };

  // Nhãn hiển thị thân thiện (VD: "14/10/2026 · Còn 1 ngày")
  const displayLabel = useMemo(() => {
    if (!value) return null;
    const formatted = formatDisplayDate(value);
    const diff = calculateDateDiffInDays(value);
    let note = '';
    if (diff === 0) note = '· Hôm nay';
    else if (diff === 1) note = '· Ngày mai';
    else if (diff > 1) note = `· Còn ${diff} ngày`;
    else if (diff === -1) note = '· Quá hạn 1 ngày';
    else if (diff < -1) note = `· Quá hạn ${Math.abs(diff)} ngày`;
    return `${formatted} ${note}`;
  }, [value]);

  const todayIso = useMemo(() => today.toISOString().split('T')[0], [today]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-medium text-zinc-700 mb-1 flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-zinc-400" />
          {label}
        </label>
      )}

      {/* Trigger Button - Apple squircle bo tròn đẹp mắt */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 bg-white text-zinc-900 border rounded-xl text-xs sm:text-sm font-medium hover:border-zinc-300 hover:bg-zinc-50/70 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all cursor-pointer shadow-2xs ${
          error ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-4 h-4 text-zinc-400 shrink-0" />
          {displayLabel ? (
            <span className="truncate text-zinc-900 font-medium">{displayLabel}</span>
          ) : (
            <span className="text-zinc-400 truncate">{placeholder}</span>
          )}
        </span>

        {value && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            title="Xóa ngày"
            className="p-0.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>

      {error && <p className="mt-1 text-xs text-zinc-600">{error}</p>}

      {/* Popover Calendar Grid - Tự động đảo chiều (bottom-full hoặc top-full) chống bị cắt */}
      {isOpen && (
        <div
          className={`absolute left-0 w-72 sm:w-80 bg-white border border-zinc-200/90 rounded-2xl shadow-2xl z-100 p-3.5 animate-in fade-in duration-120 ${
            openUpward
              ? 'bottom-full mb-2 origin-bottom-left'
              : 'top-full mt-2 origin-top-left'
          }`}
        >
          {/* Header Tháng / Năm & Nút chuyển */}
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-sm font-bold text-zinc-900">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Tháng trước"
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Tháng sau"
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips (Hôm nay, Ngày mai, +3 ngày, +1 tuần) */}
          <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <button
              type="button"
              onClick={() => setQuickDate(0)}
              className="px-2 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium whitespace-nowrap cursor-pointer transition-colors"
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(1)}
              className="px-2 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium whitespace-nowrap cursor-pointer transition-colors"
            >
              Ngày mai
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(3)}
              className="px-2 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium whitespace-nowrap cursor-pointer transition-colors"
            >
              +3 ngày
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(7)}
              className="px-2 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium whitespace-nowrap cursor-pointer transition-colors"
            >
              +1 tuần
            </button>
          </div>

          {/* Hàng thứ trong tuần */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS_OF_WEEK.map((d) => (
              <span key={d} className="text-[11px] font-semibold text-zinc-400 py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Lưới các ô ngày (Day cells) */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell, idx) => {
              const isSelected = cell.dateString === value;
              const isToday = cell.dateString === todayIso;
              const isCurrentMonth = cell.monthOffset === 0;

              return (
                <button
                  key={`${cell.dateString}-${idx}`}
                  type="button"
                  onClick={() => {
                    onChange(cell.dateString);
                    setIsOpen(false);
                  }}
                  className={`h-8 sm:h-9 rounded-xl text-xs font-medium transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 text-white shadow-xs font-bold'
                      : isCurrentMonth
                      ? 'text-zinc-800 hover:bg-zinc-100'
                      : 'text-zinc-300 hover:bg-zinc-50'
                  } ${isToday && !isSelected ? 'ring-1 ring-zinc-900 font-semibold' : ''}`}
                >
                  <span>{cell.dayNumber}</span>
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-zinc-900 absolute bottom-1" />
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
