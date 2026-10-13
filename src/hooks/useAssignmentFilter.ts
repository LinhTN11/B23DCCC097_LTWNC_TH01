import { useMemo } from 'react';
import type { Assignment, FilterStatus } from '../types/assignment.types';
import { filterItems, sortItems } from '../utils/genericHelpers';
import { calculateDateDiffInDays } from '../utils/dateUtils';

/**
 * ============================================================================
 * BUỔI 2: CUSTOM HOOK NÂNG CAO - useAssignmentFilter
 * Đáp ứng Yêu cầu 5: Lọc theo trạng thái Tất cả / Chưa hoàn thành / Quá hạn / Đã hoàn thành
 * Kết hợp Generic function filterItems & sortItems (Buổi 1) để tái sử dụng logic
 * ============================================================================
 */

export interface AssignmentStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

export type SortField = 'dueDate' | 'title' | 'createdAt';

export function useAssignmentFilter(
  assignments: Assignment[],
  filterStatus: FilterStatus,
  searchQuery: string = '',
  sortBy: SortField = 'dueDate'
) {
  // Thống kê tổng hợp số lượng bài tập
  const stats = useMemo<AssignmentStats>(() => {
    let completed = 0;
    let overdue = 0;
    let pending = 0;

    for (const item of assignments) {
      if (item.isCompleted) {
        completed++;
      } else {
        const diff = calculateDateDiffInDays(item.dueDate);
        if (diff < 0) {
          overdue++;
        } else {
          pending++;
        }
      }
    }

    const total = assignments.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, overdue, completionRate };
  }, [assignments]);

  // Lọc bài tập theo trạng thái, từ khóa tìm kiếm và sắp xếp generic
  const filteredAssignments = useMemo(() => {
    // 1. Lọc theo trạng thái bằng generic filterItems
    const statusFiltered = filterItems(assignments, (item) => {
      if (filterStatus === 'all') return true;

      if (filterStatus === 'completed') {
        return item.isCompleted;
      }

      if (filterStatus === 'overdue') {
        return !item.isCompleted && calculateDateDiffInDays(item.dueDate) < 0;
      }

      if (filterStatus === 'pending') {
        return !item.isCompleted && calculateDateDiffInDays(item.dueDate) >= 0;
      }

      return true;
    });

    // 2. Lọc theo từ khóa tìm kiếm (nếu có)
    let searchFiltered = statusFiltered;
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      searchFiltered = filterItems(statusFiltered, (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.subject.toLowerCase().includes(lowerQuery)
      );
    }

    // 3. Sắp xếp bằng hàm generic sortItems (thể hiện Generic Constraints K extends keyof T)
    return sortItems(searchFiltered, sortBy, 'asc');
  }, [assignments, filterStatus, searchQuery, sortBy]);

  return {
    filteredAssignments,
    stats,
  };
}
