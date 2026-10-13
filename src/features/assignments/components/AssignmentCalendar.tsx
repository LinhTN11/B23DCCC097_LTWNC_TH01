import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  X,
  Clock,
  AlertCircle,
  CalendarDays,
  List
} from 'lucide-react';
import type { Assignment } from '../../../types/assignment.types';
import { PRIORITY_CONFIG } from '../../../types/assignment.types';
import { calculateDateDiffInDays, formatDisplayDate } from '../../../utils/dateUtils';
import { groupBy } from '../../../utils/genericHelpers';

export interface AssignmentCalendarProps {
  assignments: readonly Assignment[];
  onToggleStatus: (id: string) => void;
  onDeleteRequest: (assignment: Assignment) => void;
  onOpenCreateModal: (defaultDate?: string) => void;
  isLoading?: boolean;
}

const WEEKDAYS = ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'];
const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

type CalendarViewMode = 'month' | 'schedule';
type ScheduleTimeFilter = 'all' | 'overdue' | 'today' | 'week' | 'month';

/**
 * ============================================================================
 * AssignmentCalendar: Lịch bài tập phong cách chuẩn Google Calendar
 * - Lưới tháng: Tự động chia đều để lấp đầy ô (không để thừa khoảng trắng vô ích)
 * - Khi ô chỉ có 1 task: Tự động bung rộng chiếm trọn chiều cao ô, hiển thị đủ thông tin
 * - Bỏ dấu chấm (bullet) đằng trước tên task
 * - Giao diện Lịch trình: Căn chỉnh thẳng hàng tuyệt đối giữa ô tích tròn và text
 * - Bổ sung bộ lọc mốc thời gian cụ thể cho Lịch trình (Tất cả, Quá hạn, Hôm nay, 7 ngày tới, Tháng này)
 * ============================================================================
 */
export const AssignmentCalendar: React.FC<AssignmentCalendarProps> = ({
  assignments,
  onToggleStatus,
  onDeleteRequest,
  onOpenCreateModal,
  isLoading = false,
}) => {
  // Mốc ngày hôm nay cố định
  const [today] = useState(() => new Date());
  // Tháng & Năm đang hiển thị
  const [currentDate, setCurrentDate] = useState(() => new Date());
  // Chế độ xem: 'month' (lưới tháng) hoặc 'schedule' (lịch trình)
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  // Bộ lọc mốc thời gian trong Lịch trình
  const [scheduleFilter, setScheduleFilter] = useState<ScheduleTimeFilter>('all');
  // Task đang được chọn để xem chi tiết
  const [selectedTask, setSelectedTask] = useState<Assignment | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Chuỗi ISO của ngày hôm nay
  const todayIso = useMemo(() => today.toISOString().split('T')[0], [today]);

  // Gom bài tập theo ngày (YYYY-MM-DD) dùng generic groupBy (Buổi 1)
  const assignmentsByDate = useMemo(() => {
    return groupBy(assignments, (item) => item.dueDate);
  }, [assignments]);

  // Điều hướng tháng
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // Tính toán các ô ngày cho lưới tháng (35 hoặc 42 ô)
  const monthGridDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // Thứ 2 = 0, CN = 6
    const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      dayNumber: number;
      dateIso: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      items: Assignment[];
    }[] = [];

    // Các ngày của tháng trước
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevDate = new Date(currentYear, currentMonth - 1, d);
      const iso = prevDate.toISOString().split('T')[0];
      days.push({
        dayNumber: d,
        dateIso: iso,
        isCurrentMonth: false,
        isToday: iso === todayIso,
        items: assignmentsByDate[iso] || [],
      });
    }

    // Các ngày của tháng này
    for (let d = 1; d <= daysInMonth; d++) {
      const curDate = new Date(currentYear, currentMonth, d);
      const yearStr = curDate.getFullYear();
      const monthStr = String(curDate.getMonth() + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const iso = `${yearStr}-${monthStr}-${dayStr}`;
      days.push({
        dayNumber: d,
        dateIso: iso,
        isCurrentMonth: true,
        isToday: iso === todayIso,
        items: assignmentsByDate[iso] || [],
      });
    }

    // Các ngày của tháng sau lấp đầy lưới
    const totalSlots = days.length > 35 ? 42 : 35;
    const remaining = totalSlots - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(currentYear, currentMonth + 1, d);
      const iso = nextDate.toISOString().split('T')[0];
      days.push({
        dayNumber: d,
        dateIso: iso,
        isCurrentMonth: false,
        isToday: iso === todayIso,
        items: assignmentsByDate[iso] || [],
      });
    }

    return days;
  }, [currentYear, currentMonth, todayIso, assignmentsByDate]);

  // Toàn bộ danh sách ngày có bài tập dành cho chế độ Lịch trình
  const allScheduleDates = useMemo(() => {
    const dates = Object.keys(assignmentsByDate).sort();
    return dates.map((dateIso) => ({
      dateIso,
      items: assignmentsByDate[dateIso],
    }));
  }, [assignmentsByDate]);

  // Lọc lịch trình theo mốc thời gian cụ thể được chọn
  const filteredScheduleDates = useMemo(() => {
    return allScheduleDates.filter(({ dateIso, items }) => {
      const diff = calculateDateDiffInDays(dateIso);
      const dateParts = dateIso.split('-').map(Number);
      const itemYear = dateParts[0];
      const itemMonth = dateParts[1] - 1;

      if (scheduleFilter === 'overdue') {
        return diff < 0 && items.some((it) => !it.isCompleted);
      }
      if (scheduleFilter === 'today') {
        return diff === 0;
      }
      if (scheduleFilter === 'week') {
        return diff >= 0 && diff <= 7;
      }
      if (scheduleFilter === 'month') {
        return itemYear === currentYear && itemMonth === currentMonth;
      }
      return true; // 'all'
    });
  }, [allScheduleDates, scheduleFilter, currentYear, currentMonth]);

  // Thống kê số lượng theo mốc thời gian
  const scheduleCounts = useMemo(() => {
    let overdueCount = 0;
    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;

    allScheduleDates.forEach(({ dateIso, items }) => {
      const diff = calculateDateDiffInDays(dateIso);
      const dateParts = dateIso.split('-').map(Number);
      const itemYear = dateParts[0];
      const itemMonth = dateParts[1] - 1;

      if (diff < 0 && items.some((it) => !it.isCompleted)) overdueCount += items.length;
      if (diff === 0) todayCount += items.length;
      if (diff >= 0 && diff <= 7) weekCount += items.length;
      if (itemYear === currentYear && itemMonth === currentMonth) monthCount += items.length;
    });

    return {
      all: assignments.length,
      overdue: overdueCount,
      today: todayCount,
      week: weekCount,
      month: monthCount,
    };
  }, [allScheduleDates, assignments.length, currentYear, currentMonth]);

  if (isLoading) {
    return (
      <div className="space-y-4 py-4 animate-pulse">
        <div className="h-10 bg-zinc-200 rounded-2xl w-60 mb-6" />
        <div className="h-96 bg-zinc-100 rounded-3xl w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. THANH ĐIỀU KHIỂN CHUẨN GOOGLE CALENDAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-zinc-200">
        {/* Nhóm trái: Hôm nay, <, >, Tiêu đề Tháng Năm */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleTodayClick}
            className="px-3.5 py-1.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-semibold text-zinc-800 hover:bg-zinc-100 hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
          >
            Hôm nay
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              title="Tháng trước"
              className="p-1.5 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              title="Tháng sau"
              className="p-1.5 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
            {MONTH_NAMES[currentMonth]} năm {currentYear}
          </h2>
        </div>

        {/* Nhóm phải: Chuyển đổi Tháng / Lịch trình & Nút Thêm bài tập hình tròn */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Segmented Control chuyển đổi giao diện: Tháng vs Lịch trình */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-zinc-900 text-white shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Tháng</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('schedule')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'schedule'
                  ? 'bg-zinc-900 text-white shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lịch trình</span>
            </button>
          </div>

          {/* Nút Thêm bài tập hình tròn (Circular Button) */}
          <button
            type="button"
            onClick={() => onOpenCreateModal()}
            title="Thêm bài tập mới"
            className="w-8.5 h-8.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. CHẾ ĐỘ 1: LƯỚI THÁNG CHUẨN GOOGLE CALENDAR (MONTH GRID VIEW) */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden">
          {/* Hàng 7 thứ trong tuần */}
          <div className="grid grid-cols-7 border-b border-zinc-200 bg-zinc-50/70 text-center">
            {WEEKDAYS.map((weekday, idx) => (
              <div
                key={weekday}
                className={`py-2 text-[11px] sm:text-xs font-semibold text-zinc-500 uppercase tracking-wider ${
                  idx < 6 ? 'border-r border-zinc-100' : ''
                }`}
              >
                {weekday}
              </div>
            ))}
          </div>

          {/* Lưới các ô ngày (7 cột x 5 hoặc 6 hàng) */}
          <div className="grid grid-cols-7 divide-y divide-zinc-200">
            {monthGridDays.map((cell, idx) => {
              const diffFromToday = calculateDateDiffInDays(cell.dateIso);
              const isColEnd = (idx + 1) % 7 === 0;
              const hasSingleTask = cell.items.length === 1;

              return (
                <div
                  key={`${cell.dateIso}-${idx}`}
                  className={`min-h-[110px] sm:min-h-[130px] p-1.5 sm:p-2 transition-colors relative flex flex-col group ${
                    cell.isCurrentMonth ? 'bg-white' : 'bg-zinc-50/40'
                  } ${!isColEnd ? 'border-r border-zinc-100' : ''} hover:bg-zinc-50/80`}
                >
                  {/* Đầu ô: Số ngày + Nút thêm nhanh khi hover */}
                  <div className="flex items-center justify-between mb-1.5 shrink-0">
                    <span
                      className={`text-xs font-semibold inline-flex items-center justify-center ${
                        cell.isToday
                          ? 'w-6 h-6 rounded-full bg-zinc-900 text-white font-bold shadow-2xs'
                          : cell.isCurrentMonth
                          ? 'text-zinc-800'
                          : 'text-zinc-300'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* Nút cộng nhanh deadline cho ngày này */}
                    <button
                      type="button"
                      onClick={() => onOpenCreateModal(cell.dateIso)}
                      title={`Thêm bài tập ngày ${formatDisplayDate(cell.dateIso)}`}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-opacity cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* THIẾT KẾ LẤP ĐẦY Ô: Khi có 1 task thì bung rộng lấp đầy khoảng trắng, không để thừa */}
                  {hasSingleTask ? (
                    (() => {
                      const item = cell.items[0];
                      const isOverdue = !item.isCompleted && diffFromToday < 0;

                      return (
                        <div
                          onClick={() => setSelectedTask(item)}
                          title={`${item.subject}: ${item.title}`}
                          className={`flex-1 w-full flex flex-col justify-between p-2 rounded-xl text-left cursor-pointer transition-all border ${
                            item.isCompleted
                              ? 'bg-zinc-50 text-zinc-400 border-zinc-200/60 opacity-70'
                              : isOverdue
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                              : 'bg-zinc-100 hover:bg-zinc-200/90 text-zinc-900 border-zinc-200/90 shadow-2xs'
                          }`}
                        >
                          <div>
                            {/* Tag môn học */}
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider inline-block mb-1 ${
                                isOverdue && !item.isCompleted
                                  ? 'bg-white/20 text-white'
                                  : 'bg-zinc-200 text-zinc-700'
                              }`}
                            >
                              {item.subject}
                            </span>
                            {/* Tên bài tập (BỎ DẤU CHẤM) */}
                            <p
                              className={`text-xs font-semibold leading-tight line-clamp-2 ${
                                item.isCompleted ? 'line-through text-zinc-400' : ''
                              }`}
                            >
                              {item.title}
                            </p>
                          </div>

                          {/* Nhãn đếm ngược ở đáy ô */}
                          <div className="pt-1 flex items-center justify-between text-[10px] font-medium opacity-85">
                            <span>{PRIORITY_CONFIG[item.priority].label}</span>
                            <span>
                              {diffFromToday === 0
                                ? 'Hôm nay'
                                : diffFromToday < 0
                                ? `Trễ ${Math.abs(diffFromToday)}d`
                                : `Còn ${diffFromToday}d`}
                            </span>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    /* Khi có nhiều hơn 1 task: Chia đều các dải để lấp đầy ô */
                    <div className="flex-1 flex flex-col justify-stretch gap-1 min-h-0 overflow-y-auto scrollbar-none">
                      {cell.items.slice(0, 3).map((item) => {
                        const isOverdue = !item.isCompleted && diffFromToday < 0;

                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedTask(item)}
                            title={`${item.subject}: ${item.title}`}
                            className={`flex-1 min-h-[26px] px-2 py-1 rounded-lg text-[11px] font-medium truncate cursor-pointer transition-all flex items-center justify-between border ${
                              item.isCompleted
                                ? 'bg-zinc-100 text-zinc-400 line-through border-zinc-200/50'
                                : isOverdue
                                ? 'bg-zinc-900 text-white font-semibold border-zinc-900 shadow-2xs'
                                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200/80'
                            }`}
                          >
                            {/* Tên bài tập (BỎ HOÀN TOÀN DẤU CHẤM ĐẰNG TRƯỚC) */}
                            <span className="truncate">
                              <span className="font-semibold text-zinc-500 mr-1">
                                [{item.subject}]
                              </span>
                              {item.title}
                            </span>
                          </div>
                        );
                      })}

                      {/* Nếu có nhiều hơn 3 bài tập */}
                      {cell.items.length > 3 && (
                        <div
                          onClick={() => setSelectedTask(cell.items[3])}
                          className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 px-1 text-center cursor-pointer py-0.5"
                        >
                          +{cell.items.length - 3} bài nữa
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CHẾ ĐỘ 2: LỊCH TRÌNH THEO NGÀY (SCHEDULE VIEW) VỚI BỘ LỌC MỐC THỜI GIAN */}
      {viewMode === 'schedule' && (
        <div className="space-y-4">
          {/* THANH CHỌN MỐC THỜI GIAN CỤ THỂ CHO LỊCH TRÌNH */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200 overflow-x-auto scrollbar-none w-full sm:w-fit text-xs">
            {[
              { key: 'all' as const, label: 'Tất cả', count: scheduleCounts.all },
              { key: 'overdue' as const, label: 'Quá hạn', count: scheduleCounts.overdue },
              { key: 'today' as const, label: 'Hôm nay', count: scheduleCounts.today },
              { key: 'week' as const, label: '7 ngày tới', count: scheduleCounts.week },
              { key: 'month' as const, label: 'Tháng này', count: scheduleCounts.month },
            ].map((tab) => {
              const isActive = scheduleFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setScheduleFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-2xs font-bold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredScheduleDates.length === 0 ? (
            <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-200 text-zinc-500 text-xs">
              Không có bài tập nào phù hợp với mốc thời gian đã chọn.
            </div>
          ) : (
            filteredScheduleDates.map(({ dateIso, items }) => {
              const diff = calculateDateDiffInDays(dateIso);
              const isToday = dateIso === todayIso;

              return (
                <div
                  key={dateIso}
                  className="bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                  {/* Cột Ngày bên trái */}
                  <div className="sm:w-36 shrink-0 flex items-center sm:flex-col sm:items-start gap-2 border-b sm:border-b-0 sm:border-r border-zinc-100 pb-2 sm:pb-0 sm:pr-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        isToday
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 text-zinc-800'
                      }`}
                    >
                      {formatDisplayDate(dateIso)}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {isToday
                        ? 'Hôm nay'
                        : diff === 1
                        ? 'Ngày mai'
                        : diff < 0
                        ? `Trễ ${Math.abs(diff)} ngày`
                        : `Còn ${diff} ngày`}
                    </span>
                  </div>

                  {/* Danh sách bài tập trong ngày - ĐÃ CĂN CHỈNH THẲNG HÀNG TUYỆT ĐỐI */}
                  <div className="flex-1 space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 transition-colors gap-3"
                      >
                        {/* Cụm Checkbox tròn + Text (căn giữa hoàn hảo, không lệch) */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => onToggleStatus(item.id)}
                            title={item.isCompleted ? 'Bỏ hoàn thành' : 'Đánh dấu hoàn thành'}
                            className="w-5 h-5 flex items-center justify-center shrink-0 cursor-pointer text-zinc-400 hover:text-zinc-900 transition-colors"
                          >
                            {item.isCompleted ? (
                              <CheckCircle2 className="w-4.5 h-4.5 text-zinc-900" />
                            ) : (
                              <Circle className="w-4.5 h-4.5 hover:text-zinc-700" />
                            )}
                          </button>

                          <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap leading-none py-0.5">
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-200/80 text-zinc-700 shrink-0">
                              {item.subject}
                            </span>
                            <span
                              className={`text-xs sm:text-sm font-medium text-zinc-900 truncate leading-snug ${
                                item.isCompleted ? 'line-through text-zinc-400' : ''
                              }`}
                            >
                              {item.title}
                            </span>
                          </div>
                        </div>

                        {/* Cụm độ ưu tiên & nút xóa */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-200 text-zinc-700">
                            {PRIORITY_CONFIG[item.priority].label}
                          </span>
                          <button
                            type="button"
                            onClick={() => onDeleteRequest(item)}
                            title="Xóa bài tập"
                            className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 4. MODAL XEM CHI TIẾT TASK KHI CLICK VÀO LỊCH (TASK DETAIL DIALOG) */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 w-full max-w-sm p-5 space-y-4 animate-in zoom-in-95 duration-100">
            {/* Header Dialog */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Chi tiết bài tập
              </span>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thông tin chính */}
            <div className="space-y-2">
              <div className="inline-block px-2.5 py-0.5 rounded-lg bg-zinc-100 text-zinc-800 text-xs font-semibold border border-zinc-200">
                {selectedTask.subject}
              </div>

              <h3 className="text-base font-bold text-zinc-900 leading-snug">
                {selectedTask.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-zinc-600 pt-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Hạn nộp: {formatDisplayDate(selectedTask.dueDate)}</span>
                <span className="text-zinc-400">·</span>
                <span className="font-semibold text-zinc-800">
                  {(() => {
                    const diff = calculateDateDiffInDays(selectedTask.dueDate);
                    if (diff === 0) return 'Hôm nay';
                    if (diff === 1) return 'Ngày mai';
                    if (diff > 1) return `Còn ${diff} ngày`;
                    return `Quá hạn ${Math.abs(diff)} ngày`;
                  })()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
                <span>Độ ưu tiên: {PRIORITY_CONFIG[selectedTask.priority].label}</span>
              </div>
            </div>

            {/* Hành động */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => {
                  onDeleteRequest(selectedTask);
                  setSelectedTask(null);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onToggleStatus(selectedTask.id);
                  setSelectedTask(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedTask.isCompleted
                    ? 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {selectedTask.isCompleted ? 'Chưa hoàn thành' : 'Đánh dấu đã xong'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
