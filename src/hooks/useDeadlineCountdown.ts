import { useMemo } from 'react';
import { calculateDateDiffInDays } from '../utils/dateUtils';

/**
 * ============================================================================
 * BUỔI 2: CUSTOM HOOK NÂNG CAO - useDeadlineCountdown
 * Đáp ứng Yêu cầu 6: Mỗi bài tập hiển thị "Còn X ngày" hoặc "Quá hạn Y ngày"
 * ============================================================================
 */

export interface DeadlineCountdownResult {
  diffDays: number;
  isOverdue: boolean;
  isToday: boolean;
  displayText: string;
  badgeColor: 'danger' | 'warning' | 'primary' | 'success' | 'default';
  urgency: 'overdue' | 'today' | 'near' | 'comfortable';
}

/**
 * Hook tính toán thời hạn deadline chuẩn xác theo ngày, bỏ qua sai lệch giờ/phút
 * @param dueDate Chuỗi ngày tháng dạng YYYY-MM-DD
 * @param isCompleted Trạng thái hoàn thành bài tập
 */
export function useDeadlineCountdown(dueDate: string, isCompleted: boolean = false): DeadlineCountdownResult {
  return useMemo(() => {
    const diffDays = calculateDateDiffInDays(dueDate);

    const isOverdue = diffDays < 0;
    const isToday = diffDays === 0;

    if (isCompleted) {
      return {
        diffDays,
        isOverdue: false,
        isToday: false,
        displayText: 'Đã hoàn thành',
        badgeColor: 'success',
        urgency: 'comfortable',
      };
    }

    if (isOverdue) {
      const positiveDays = Math.abs(diffDays);
      return {
        diffDays,
        isOverdue: true,
        isToday: false,
        displayText: `Quá hạn ${positiveDays} ngày`,
        badgeColor: 'danger',
        urgency: 'overdue',
      };
    }

    if (isToday) {
      return {
        diffDays: 0,
        isOverdue: false,
        isToday: true,
        displayText: 'Đến hạn hôm nay',
        badgeColor: 'warning',
        urgency: 'today',
      };
    }

    // Còn X ngày
    const urgency = diffDays <= 2 ? 'near' : 'comfortable';
    const badgeColor = diffDays <= 2 ? 'warning' : 'primary';

    return {
      diffDays,
      isOverdue: false,
      isToday: false,
      displayText: `Còn ${diffDays} ngày`,
      badgeColor,
      urgency,
    };
  }, [dueDate, isCompleted]);
}
