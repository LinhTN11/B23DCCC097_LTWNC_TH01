import React from 'react';
import { Plus, RefreshCw, CalendarDays, CheckSquare, PanelLeft } from 'lucide-react';
import { getTodayFormattedVi } from '../../utils/dateUtils';

export interface HeaderProps {
  onOpenCreateModal: () => void;
  onRefreshData: () => void;
  isLoading: boolean;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  onRefreshData,
  isLoading,
  onToggleSidebar,
}) => {
  const todayFormatted = React.useMemo(() => getTodayFormattedVi(), []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200/90 sticky top-0 z-30 transition-all">
      <div className="w-full px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Cụm Logo & Tiêu đề (nút toggle ở đây chỉ kích hoạt cho mobile khi sidebar ẩn hẳn) */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                title="Mở thanh điều hướng"
                className="md:hidden p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/80 transition-colors cursor-pointer"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white shrink-0 shadow-xs">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight leading-none">
                  Student Deadline Tracker
                </h1>
                <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                  Quản lý deadline bài tập cá nhân
                </p>
              </div>
            </div>
          </div>

          {/* Cụm nút hành động bên phải */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 text-xs text-zinc-600 border border-zinc-200">
              <CalendarDays className="w-3.5 h-3.5 text-zinc-500" />
              <span>{todayFormatted}</span>
            </div>

            {/* Nút Tải lại Mock API */}
            <button
              type="button"
              onClick={onRefreshData}
              disabled={isLoading}
              title="Tải lại dữ liệu mẫu từ Mock API"
              className="cursor-pointer px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100 border border-zinc-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Tải lại API</span>
            </button>

            {/* Nút Thêm bài tập hình tròn (Circular Button) theo yêu cầu */}
            <button
              type="button"
              onClick={onOpenCreateModal}
              title="Thêm bài tập mới"
              className="w-9 h-9 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all flex items-center justify-center shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
