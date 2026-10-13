import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  fetchInitialAssignments,
} from './features/assignments/assignmentsThunks';
import {
  addAssignment,
  toggleAssignmentStatus,
  deleteAssignment,
  setFilterStatus,
  setSearchQuery,
} from './features/assignments/assignmentsSlice';
import type { Assignment, CreateAssignmentDto, FilterStatus } from './types/assignment.types';
import { useAssignmentFilter, type SortField } from './hooks/useAssignmentFilter';
import { Header } from './components/common/Header';
import { Sidebar, type ActiveView } from './components/common/Sidebar';
import { AssignmentFilters } from './features/assignments/components/AssignmentFilters';
import { AssignmentList } from './features/assignments/components/AssignmentList';
import { AssignmentCalendar } from './features/assignments/components/AssignmentCalendar';
import { AssignmentForm } from './features/assignments/components/AssignmentForm';
import { ConfirmModal } from './components/common/ConfirmModal';
import { AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status, error, filterStatus, searchQuery } = useAppSelector(
    (state) => state.assignments
  );

  // Điều hướng xem: Danh sách (list) hoặc Lịch bài tập kiểu Google Calendar (calendar)
  const [activeView, setActiveView] = useState<ActiveView>('list');
  // Trạng thái thu gọn/mở rộng thanh sidebar thò thụt (chỉ 1 nút điều khiển từ Header)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formInitialDate, setFormInitialDate] = useState<string | undefined>(undefined);
  const [deletingAssignment, setDeletingAssignment] = useState<Assignment | null>(null);
  const [sortBy, setSortBy] = useState<SortField>('dueDate');

  // Yêu cầu 7: Khi khởi động app, lấy danh sách mẫu ban đầu từ 1 API giả lập
  useEffect(() => {
    dispatch(fetchInitialAssignments());
  }, [dispatch]);

  // Hook nâng cao xử lý filtering, sorting và stats (Buổi 2 + Buổi 1 generics)
  const { filteredAssignments, stats } = useAssignmentFilter(
    items,
    filterStatus,
    searchQuery,
    sortBy
  );

  // Handlers
  const handleOpenCreateModal = (defaultDate?: string) => {
    setFormInitialDate(defaultDate);
    setIsFormOpen(true);
  };

  const handleCreateAssignment = (dto: CreateAssignmentDto) => {
    dispatch(addAssignment(dto));
  };

  const handleToggleStatus = (id: string) => {
    dispatch(toggleAssignmentStatus(id));
  };

  const handleDeleteRequest = (assignment: Assignment) => {
    setDeletingAssignment(assignment);
  };

  const handleConfirmDelete = () => {
    if (deletingAssignment) {
      dispatch(deleteAssignment(deletingAssignment.id));
      setDeletingAssignment(null);
    }
  };

  const handleFilterChange = (newStatus: FilterStatus) => {
    dispatch(setFilterStatus(newStatus));
  };

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleRefreshData = () => {
    dispatch(fetchInitialAssignments());
  };

  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans text-zinc-900 antialiased">
      {/* 1. Thanh Sidebar thò thụt (Collapsible Sidebar) */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        stats={stats}
        onOpenCreateModal={() => handleOpenCreateModal()}
        onFilterStatusSelect={handleFilterChange}
        currentFilter={filterStatus}
      />

      {/* 2. Khu vực nội dung chính (Main Content Area) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header trên cùng có nút toggle Sidebar duy nhất và Tải lại API */}
        <Header
          onOpenCreateModal={() => handleOpenCreateModal()}
          onRefreshData={handleRefreshData}
          isLoading={isLoading}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Nội dung thay đổi theo activeView */}
        <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col gap-6">
          {/* Thông báo lỗi nếu có */}
          {status === 'failed' && (
            <div className="bg-zinc-100 border border-zinc-300 text-zinc-800 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-zinc-900 shrink-0" />
              <p className="font-medium">{error || 'Đã có lỗi xảy ra khi tải dữ liệu'}</p>
            </div>
          )}

          {/* GIAO DIỆN 1: DANH SÁCH BÀI TẬP (LIST VIEW) */}
          {activeView === 'list' && (
            <>
              {/* Thanh lọc trạng thái, tìm kiếm và HeroUIDropdown sắp xếp */}
              <AssignmentFilters
                currentFilter={filterStatus}
                onFilterChange={handleFilterChange}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                sortBy={sortBy}
                onSortChange={setSortBy}
                stats={stats}
              />

              {/* Danh sách bài tập bọc bởi HOC withLoading */}
              <div className="flex-1">
                <AssignmentList
                  isLoading={isLoading}
                  loadingMessage="Đang tải danh sách bài tập..."
                  assignments={filteredAssignments}
                  onToggleStatus={handleToggleStatus}
                  onDeleteRequest={handleDeleteRequest}
                  onOpenCreateModal={() => handleOpenCreateModal()}
                />
              </div>
            </>
          )}

          {/* GIAO DIỆN 2: LỊCH CHUẨN GOOGLE CALENDAR (MONTH GRID & SCHEDULE VIEW) */}
          {activeView === 'calendar' && (
            <AssignmentCalendar
              assignments={items}
              onToggleStatus={handleToggleStatus}
              onDeleteRequest={handleDeleteRequest}
              onOpenCreateModal={handleOpenCreateModal}
              isLoading={isLoading}
            />
          )}
        </main>

        {/* Footer tối giản đen trắng */}
        <footer className="bg-white border-t border-zinc-200/80 py-4 text-center text-xs text-zinc-400">
          <p className="font-medium">Student Deadline Tracker © 2026</p>
        </footer>
      </div>

      {/* Modal thêm bài tập mới (Yêu cầu 2) - Tích hợp HeroUIDatePicker & HeroUIDropdown không bị cắt */}
      <AssignmentForm
        key={isFormOpen ? formInitialDate || 'open' : 'closed'}
        isOpen={isFormOpen}
        initialDate={formInitialDate}
        onClose={() => {
          setIsFormOpen(false);
          setFormInitialDate(undefined);
        }}
        onSubmit={handleCreateAssignment}
      />

      {/* Modal xác nhận xoá bài tập (Yêu cầu 4) */}
      <ConfirmModal
        isOpen={deletingAssignment !== null}
        assignment={deletingAssignment}
        onClose={() => setDeletingAssignment(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default App;
