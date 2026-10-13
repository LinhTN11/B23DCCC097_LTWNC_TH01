import React from 'react';
import {
  LayoutGrid,
  CalendarDays,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ListTodo,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';

export type ActiveView = 'list' | 'calendar';

export interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  stats: {
    total: number;
    pending: number;
    overdue: number;
    completed: number;
  };
  onOpenCreateModal: () => void;
  onFilterStatusSelect?: (status: 'all' | 'pending' | 'overdue' | 'completed') => void;
  currentFilter?: string;
}

/**
 * ============================================================================
 * Sidebar: Thanh điều hướng thò thụt (Collapsible Sidebar)
 * - Nút focus khi thu gọn: Hình vuông bo góc chuẩn (w-10 h-10 rounded-xl)
 * - Khi thu gọn: Logo đóng vai trò là nút mở rộng (hover đổi thành icon mở)
 * - Nút thêm task thu nhỏ thành hình tròn
 * - Khi mục "Lịch" được focus/active, badge "X trễ" chuyển thành NỀN TRẮNG CHỮ ĐEN
 * ============================================================================
 */
export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  isCollapsed,
  onToggleCollapse,
  stats,
  onOpenCreateModal,
  onFilterStatusSelect,
  currentFilter = 'all',
}) => {
  const isListActive = activeView === 'list';
  const isCalendarActive = activeView === 'calendar';

  return (
    <>
      {/* Mobile Backdrop Overlay khi sidebar mở trên màn hình nhỏ */}
      {!isCollapsed && (
        <div
          onClick={onToggleCollapse}
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-2xs md:hidden transition-opacity cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-white border-r border-zinc-200/90 flex flex-col transition-all duration-300 ease-in-out select-none ${
          isCollapsed
            ? '-translate-x-full md:translate-x-0 md:w-16'
            : 'w-64 sm:w-72 shadow-xl md:shadow-none translate-x-0'
        }`}
      >
        {/* 1. Header Sidebar: Nút đóng mở ở Sidebar, khi thu vào nút logo hover đổi thành nút mở */}
        <div className="h-14 px-3 border-b border-zinc-100 flex items-center justify-between">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xs sm:text-sm font-bold text-zinc-900 truncate tracking-tight">
                    Deadline Tracker
                  </h2>
                  <p className="text-[11px] text-zinc-500 truncate">LTWNC - TH01</p>
                </div>
              </div>

              {/* Nút thu gọn Sidebar đặt ở góc phải header sidebar */}
              <button
                type="button"
                onClick={onToggleCollapse}
                title="Thu gọn thanh điều hướng"
                className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
              >
                <PanelLeftClose className="w-4 h-4 hidden md:block" />
                <X className="w-4 h-4 md:hidden" />
              </button>
            </>
          ) : (
            /* Khi thu vào: Logo là hình vuông bo góc, hover đổi thành icon mở */
            <div className="w-full flex justify-center">
              <button
                type="button"
                onClick={onToggleCollapse}
                title="Nhấn để mở rộng thanh điều hướng"
                className="group relative w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
              >
                <GraduationCap className="w-5 h-5 transition-all duration-150 group-hover:opacity-0 group-hover:scale-75 absolute" />
                <PanelLeftOpen className="w-5 h-5 opacity-0 scale-75 transition-all duration-150 group-hover:opacity-100 group-hover:scale-100 absolute text-white" />
              </button>
            </div>
          )}
        </div>

        {/* 2. Nút Thêm nhanh bài tập (hình tròn khi thu gọn) */}
        <div className="p-2.5 flex justify-center">
          <button
            type="button"
            onClick={onOpenCreateModal}
            title="Thêm bài tập mới"
            className={`bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs sm:text-sm transition-all flex items-center justify-center cursor-pointer shadow-xs ${
              isCollapsed
                ? 'w-10 h-10 rounded-full'
                : 'w-full py-2 px-3 rounded-xl gap-2'
            }`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Thêm bài tập</span>}
          </button>
        </div>

        {/* 3. Danh mục điều hướng chính */}
        <div className={`py-1.5 flex-1 overflow-y-auto space-y-1.5 flex flex-col ${isCollapsed ? 'px-2 items-center' : 'px-2.5'}`}>
          {!isCollapsed && (
            <div className="mb-2 px-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Chế độ xem
            </div>
          )}

          {/* Mục 1: Danh sách bài tập (Task List) - HÌNH VUÔNG BO GÓC (w-10 h-10 rounded-xl) KHI THU GỌN */}
          <button
            type="button"
            onClick={() => onViewChange('list')}
            title="Danh sách bài tập"
            className={`flex items-center text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              isListActive
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
            } ${
              isCollapsed
                ? 'w-10 h-10 rounded-xl justify-center mx-auto p-0 shrink-0'
                : 'w-full justify-between px-3 py-2.5 rounded-xl'
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 min-w-0'}`}>
              <LayoutGrid
                className={`shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} ${
                  isListActive ? 'text-white' : 'text-zinc-500'
                }`}
              />
              {!isCollapsed && <span className="truncate">Danh sách bài tập</span>}
            </div>

            {!isCollapsed && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                  isListActive
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {stats.total}
              </span>
            )}
          </button>

          {/* Mục 2: Lịch bài tập (Google Calendar) - HÌNH VUÔNG BO GÓC (w-10 h-10 rounded-xl) KHI THU GỌN */}
          <button
            type="button"
            onClick={() => onViewChange('calendar')}
            title="Lịch bài tập"
            className={`flex items-center text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              isCalendarActive
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
            } ${
              isCollapsed
                ? 'w-10 h-10 rounded-xl justify-center mx-auto p-0 shrink-0'
                : 'w-full justify-between px-3 py-2.5 rounded-xl'
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 min-w-0'}`}>
              <CalendarDays
                className={`shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} ${
                  isCalendarActive ? 'text-white' : 'text-zinc-500'
                }`}
              />
              {!isCollapsed && <span className="truncate">Lịch bài tập</span>}
            </div>

            {/* Khi ô ngoài focus/active: badge "X trễ" chuyển thành NỀN TRẮNG CHỮ ĐEN */}
            {!isCollapsed && stats.overdue > 0 ? (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                  isCalendarActive
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'bg-zinc-900 text-white border border-zinc-700'
                }`}
              >
                {stats.overdue} trễ
              </span>
            ) : !isCollapsed ? (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  isCalendarActive
                    ? 'bg-white text-zinc-900 font-bold shadow-2xs'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {stats.pending}
              </span>
            ) : null}
          </button>

          {/* Section: Phân loại nhanh trạng thái khi mở rộng */}
          {!isCollapsed && onFilterStatusSelect && (
            <div className="pt-4 space-y-1 w-full">
              <div className="px-2 pb-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Trạng thái
              </div>

              <button
                type="button"
                onClick={() => onFilterStatusSelect('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  currentFilter === 'all'
                    ? 'bg-zinc-100 text-zinc-900 font-bold'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ListTodo className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Tất cả bài tập</span>
                </div>
                <span className="text-zinc-400">{stats.total}</span>
              </button>

              <button
                type="button"
                onClick={() => onFilterStatusSelect('pending')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  currentFilter === 'pending'
                    ? 'bg-zinc-100 text-zinc-900 font-bold'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Chưa hoàn thành</span>
                </div>
                <span className="text-zinc-500 font-semibold">{stats.pending}</span>
              </button>

              <button
                type="button"
                onClick={() => onFilterStatusSelect('overdue')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  currentFilter === 'overdue'
                    ? 'bg-zinc-100 text-zinc-900 font-bold'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-zinc-800" />
                  <span>Quá hạn nộp</span>
                </div>
                <span className="text-zinc-800 font-bold">{stats.overdue}</span>
              </button>

              <button
                type="button"
                onClick={() => onFilterStatusSelect('completed')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  currentFilter === 'completed'
                    ? 'bg-zinc-100 text-zinc-900 font-bold'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Đã hoàn thành</span>
                </div>
                <span className="text-zinc-400">{stats.completed}</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. Footer Sidebar: Thẻ sinh viên tối giản */}
        <div className="p-3 border-t border-zinc-100">
          {!isCollapsed ? (
            <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-zinc-900 truncate">Sinh viên Đại học</p>
                <p className="text-[11px] text-zinc-500 truncate">Bản ghi cá nhân</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse shrink-0" />
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" title="Trực tuyến" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
