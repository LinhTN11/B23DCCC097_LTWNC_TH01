import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles
} from 'lucide-react';
import type { Assignment } from '../../../types/assignment.types';
import { PRIORITY_CONFIG } from '../../../types/assignment.types';
import { calculateDateDiffInDays, formatDisplayDate } from '../../../utils/dateUtils';
import { groupBy } from '../../../utils/genericHelpers';

export interface AssignmentAgendaProps {
  assignments: readonly Assignment[];
  onToggleStatus: (id: string) => void;
  onDeleteRequest: (assignment: Assignment) => void;
  onOpenCreateModal: () => void;
  isLoading?: boolean;
}

/**
 * Helper định dạng thứ và ngày tiếng Việt từ chuỗi YYYY-MM-DD
 */
function formatViDateFull(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  } catch {
    return dateString;
  }
}

/**
 * ============================================================================
 * AssignmentAgenda: Lịch hiển thị các task theo ngày chiều dọc (Vertical Agenda)
 * Phong cách Apple Reminders & Linear & Things 3
 * Bo góc squircle (rounded-2xl), timeline dọc dính liền, hiển thị rõ deadline
 * ============================================================================
 */
export const AssignmentAgenda: React.FC<AssignmentAgendaProps> = ({
  assignments,
  onToggleStatus,
  onDeleteRequest,
  onOpenCreateModal,
  isLoading = false,
}) => {
  const [showCompleted, setShowCompleted] = useState(true);
  const [currentDate] = useState(() => new Date());

  // Định dạng ngày hôm nay & ngày mai chuẩn React purity
  const todayFormatted = useMemo(() => {
    return currentDate.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, [currentDate]);

  const tomorrowFormatted = useMemo(() => {
    const tm = new Date(currentDate);
    tm.setDate(tm.getDate() + 1);
    return tm.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, [currentDate]);

  // Phân loại danh sách bài tập theo các nhóm ngày
  const { overdueList, todayList, tomorrowList, upcomingGroups, completedList } =
    useMemo(() => {
      const overdue: Assignment[] = [];
      const today: Assignment[] = [];
      const tomorrow: Assignment[] = [];
      const upcoming: Assignment[] = [];
      const completed: Assignment[] = [];

      assignments.forEach((item) => {
        if (item.isCompleted) {
          completed.push(item);
          return;
        }

        const diff = calculateDateDiffInDays(item.dueDate);
        if (diff < 0) {
          overdue.push(item);
        } else if (diff === 0) {
          today.push(item);
        } else if (diff === 1) {
          tomorrow.push(item);
        } else {
          upcoming.push(item);
        }
      });

      // Sắp xếp bài tập quá hạn từ cũ nhất đến mới nhất
      overdue.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

      // Gom nhóm bài tập sắp tới theo từng ngày cụ thể bằng hàm groupBy (Buổi 1 Generics)
      const grouped = groupBy(upcoming, (item) => item.dueDate);
      const sortedDates = Object.keys(grouped).sort();

      return {
        overdueList: overdue,
        todayList: today,
        tomorrowList: tomorrow,
        upcomingGroups: sortedDates.map((date) => ({
          date,
          items: grouped[date],
        })),
        completedList: completed,
      };
    }, [assignments]);

  const totalActive = overdueList.length + todayList.length + tomorrowList.length +
    upcomingGroups.reduce((acc, g) => acc + g.items.length, 0);

  if (isLoading) {
    return (
      <div className="space-y-4 py-4 animate-pulse">
        <div className="h-8 bg-zinc-200 rounded-xl w-48 mb-6" />
        <div className="h-24 bg-zinc-100 rounded-2xl w-full" />
        <div className="h-24 bg-zinc-100 rounded-2xl w-full" />
        <div className="h-24 bg-zinc-100 rounded-2xl w-full" />
      </div>
    );
  }

  // Task item card rendering con bên trong
  const renderTaskItem = (item: Assignment) => {
    const diff = calculateDateDiffInDays(item.dueDate);
    const priorityMeta = PRIORITY_CONFIG[item.priority];

    let countdownLabel = '';
    let countdownBadgeClass = '';

    if (item.isCompleted) {
      countdownLabel = 'Đã hoàn thành';
      countdownBadgeClass = 'bg-zinc-100 text-zinc-500 border border-zinc-200';
    } else if (diff < 0) {
      countdownLabel = `Quá hạn ${Math.abs(diff)} ngày`;
      countdownBadgeClass = 'bg-zinc-900 text-white font-bold';
    } else if (diff === 0) {
      countdownLabel = 'Hạn nộp hôm nay';
      countdownBadgeClass = 'bg-zinc-900 text-white font-medium';
    } else if (diff === 1) {
      countdownLabel = 'Hạn nộp ngày mai';
      countdownBadgeClass = 'bg-zinc-200 text-zinc-900 font-medium';
    } else {
      countdownLabel = `Còn ${diff} ngày`;
      countdownBadgeClass = 'bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium';
    }

    return (
      <div
        key={item.id}
        className={`group flex items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:shadow-xs hover:border-zinc-300 transition-all ${
          item.isCompleted ? 'opacity-60 bg-zinc-50/50' : ''
        }`}
      >
        {/* Nút Checkbox hoàn thành tròn kiểu Apple Reminders */}
        <button
          type="button"
          onClick={() => onToggleStatus(item.id)}
          title={item.isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
          className="mt-0.5 sm:mt-0 p-1 text-zinc-400 hover:text-zinc-900 transition-colors shrink-0 cursor-pointer"
        >
          {item.isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-zinc-900" />
          ) : (
            <Circle className="w-5 h-5 group-hover:text-zinc-700" />
          )}
        </button>

        {/* Nội dung task */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Tag Môn học */}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200/60">
              {item.subject}
            </span>

            {/* Tag Độ ưu tiên */}
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-50 text-zinc-600 border border-zinc-200">
              {priorityMeta.label}
            </span>
          </div>

          <h4
            className={`text-xs sm:text-sm font-semibold text-zinc-900 tracking-tight truncate ${
              item.isCompleted ? 'line-through text-zinc-400' : ''
            }`}
          >
            {item.title}
          </h4>
        </div>

        {/* Countdown Badge & Nút Xóa */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-[11px] px-2.5 py-1 rounded-xl whitespace-nowrap ${countdownBadgeClass}`}
          >
            {countdownLabel}
          </span>

          <button
            type="button"
            onClick={() => onDeleteRequest(item)}
            title="Xóa bài tập này"
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header thanh lịch của Lịch theo ngày */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-zinc-900" />
            Lịch theo ngày (Agenda)
          </h2>
          <p className="text-xs text-zinc-500">
            Dòng thời gian bài tập sắp xếp theo trình tự ngày, không ràng buộc theo khung giờ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-3 py-1 rounded-xl bg-zinc-100 text-zinc-700 border border-zinc-200">
            {totalActive} deadline đang chờ
          </span>

          <button
            type="button"
            onClick={onOpenCreateModal}
            className="cursor-pointer px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm task
          </button>
        </div>
      </div>

      {/* Trường hợp không có bất kỳ bài tập nào */}
      {assignments.length === 0 && (
        <div className="text-center py-16 px-4 bg-zinc-50 rounded-3xl border border-zinc-200/80">
          <Sparkles className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-900">Không có deadline nào</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Lịch trình của bạn đang trống. Hãy nhấn nút thêm bài tập để bắt đầu ghi chú hạn nộp.
          </p>
        </div>
      )}

      {/* DÒNG THỜI GIAN THEO CHIỀU DỌC (VERTICAL TIMELINE STREAM) */}
      <div className="relative pl-4 sm:pl-6 space-y-7 before:absolute before:left-1.5 sm:before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200">
        {/* 1. MỤC: QUÁ HẠN (OVERDUE) */}
        {overdueList.length > 0 && (
          <section className="relative space-y-3">
            {/* Timeline Node Icon */}
            <div className="absolute -left-4 sm:-left-6 top-1 w-3.5 h-3.5 rounded-full bg-zinc-900 ring-4 ring-white" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-300 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-zinc-900" />
                  Cần xử lý ngay: Quá hạn
                </span>
                <span className="text-xs font-semibold text-zinc-500">
                  ({overdueList.length} bài)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {overdueList.map(renderTaskItem)}
            </div>
          </section>
        )}

        {/* 2. MỤC: HÔM NAY (TODAY) */}
        <section className="relative space-y-3">
          <div className="absolute -left-4 sm:-left-6 top-1 w-3.5 h-3.5 rounded-full bg-zinc-900 ring-4 ring-white" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 bg-zinc-900 text-white px-3 py-1 rounded-lg shadow-2xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Hôm nay
              </span>
              <span className="text-xs text-zinc-500">
                {todayFormatted}
              </span>
            </div>
            <span className="text-xs font-medium text-zinc-400">
              {todayList.length} bài
            </span>
          </div>

          {todayList.length > 0 ? (
            <div className="space-y-2">
              {todayList.map(renderTaskItem)}
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-xs text-zinc-500 italic">
              Không có bài tập nào đến hạn trong ngày hôm nay.
            </div>
          )}
        </section>

        {/* 3. MỤC: NGÀY MAI (TOMORROW) */}
        <section className="relative space-y-3">
          <div className="absolute -left-4 sm:-left-6 top-1 w-3.5 h-3.5 rounded-full bg-zinc-400 ring-4 ring-white" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-800 bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200">
                Ngày mai
              </span>
              <span className="text-xs text-zinc-500">
                {tomorrowFormatted}
              </span>
            </div>
            <span className="text-xs font-medium text-zinc-400">
              {tomorrowList.length} bài
            </span>
          </div>

          {tomorrowList.length > 0 ? (
            <div className="space-y-2">
              {tomorrowList.map(renderTaskItem)}
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-xs text-zinc-500 italic">
              Không có bài tập nào đến hạn vào ngày mai.
            </div>
          )}
        </section>

        {/* 4. MỤC: CÁC NGÀY TIẾP THEO (UPCOMING GROUPED BY DATE) */}
        {upcomingGroups.length > 0 && (
          <div className="space-y-6 pt-2">
            {upcomingGroups.map(({ date, items }) => (
              <section key={date} className="relative space-y-3">
                <div className="absolute -left-4 sm:-left-6 top-1 w-3.5 h-3.5 rounded-full bg-zinc-300 ring-4 ring-white" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-800 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200">
                      {formatViDateFull(date)}
                    </span>
                    <span className="text-xs text-zinc-400">
                      ({formatDisplayDate(date)})
                    </span>
                  </div>
                  <span className="text-xs font-medium text-zinc-400">
                    {items.length} bài
                  </span>
                </div>

                <div className="space-y-2">
                  {items.map(renderTaskItem)}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* 5. MỤC: ĐÃ HOÀN THÀNH (COMPLETED - COLLAPSIBLE) */}
        {completedList.length > 0 && (
          <section className="relative space-y-3 pt-4">
            <div className="absolute -left-4 sm:-left-6 top-5 w-3.5 h-3.5 rounded-full bg-zinc-200 ring-4 ring-white" />

            <button
              type="button"
              onClick={() => setShowCompleted((prev) => !prev)}
              className="flex items-center justify-between w-full py-1.5 text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors">
                  Đã hoàn thành ({completedList.length})
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-400 group-hover:text-zinc-700">
                <span>{showCompleted ? 'Thu gọn' : 'Xem lại'}</span>
                {showCompleted ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </div>
            </button>

            {showCompleted && (
              <div className="space-y-2 animate-in fade-in duration-150">
                {completedList.map(renderTaskItem)}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
