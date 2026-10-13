/* oxlint-disable react/only-export-components */
import React from 'react';
import { BookOpenCheck, CalendarPlus } from 'lucide-react';
import type { Assignment } from '../../../types/assignment.types';
import { AssignmentCard } from './AssignmentCard';
import { withLoading } from '../../../components/hoc/withLoading';

/**
 * ============================================================================
 * YÊU CẦU 1: HIỂN THỊ DANH SÁCH BÀI TẬP
 * Phong cách đen trắng tối giản nguyên bản của HeroUI
 * ============================================================================
 */

export interface AssignmentListProps {
  assignments: Assignment[];
  onToggleStatus: (id: string) => void;
  onDeleteRequest: (assignment: Assignment) => void;
  onOpenCreateModal: () => void;
}

export const RawAssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  onToggleStatus,
  onDeleteRequest,
  onOpenCreateModal,
}) => {
  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-dashed border-zinc-300">
        <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 mb-3.5">
          <BookOpenCheck className="w-6 h-6" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-zinc-900">Không có bài tập nào</h3>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mt-1 mb-5">
          Không tìm thấy bài tập phù hợp với bộ lọc hiện tại.
        </p>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 transition-all"
        >
          <CalendarPlus className="w-4 h-4" />
          Thêm bài tập mới
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4.5">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          onToggleStatus={onToggleStatus}
          onDeleteRequest={onDeleteRequest}
        >
          <AssignmentCard.Header />
          <AssignmentCard.Body />
          <AssignmentCard.Footer />
        </AssignmentCard>
      ))}
    </div>
  );
};

// Áp dụng HOC withLoading (Buổi 2 Design Pattern)
export const AssignmentList = withLoading(RawAssignmentList);
