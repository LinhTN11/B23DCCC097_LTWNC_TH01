/**
 * ============================================================================
 * BUỔI 1: TYPESCRIPT NÂNG CAO (ADVANCED TYPESCRIPT)
 * ============================================================================
 * - Generic types: ApiResponse<T>, Identifiable<TId>, FilterPredicate<T>, PaginatedData<T>
 * - Utility types: Omit, Pick, Partial, Record, Readonly
 * - Custom Type Guards: isPriority, isFilterStatus, isAssignment, isValidDateString
 * ============================================================================
 */

// --- 1. GENERIC TYPES ---

/**
 * Generic biểu diễn phản hồi chuẩn từ API hoặc dịch vụ dữ liệu
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

/**
 * Generic ràng buộc mọi thực thể có định danh ID duy nhất
 */
export interface Identifiable<TId = string> {
  id: TId;
}

/**
 * Generic cho hàm lọc dữ liệu bất kỳ
 */
export type FilterPredicate<T> = (item: T) => boolean;

/**
 * Generic helper cho trạng thái entity trong Redux store
 */
export interface AsyncState<T> {
  data: T;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// --- 2. DOMAIN TYPES ---

export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type Priority = typeof PRIORITIES[number];

export const FILTER_STATUSES = ['all', 'pending', 'overdue', 'completed'] as const;
export type FilterStatus = typeof FILTER_STATUSES[number];

export interface Assignment extends Identifiable<string> {
  title: string;
  subject: string;
  dueDate: string; // ISO date string YYYY-MM-DD
  priority: Priority;
  isCompleted: boolean;
  createdAt: string;
}

// --- 3. UTILITY TYPES ---

/**
 * DTO khi tạo bài tập mới: loại bỏ id, createdAt và isCompleted do hệ thống tự sinh
 * Thể hiện: Omit<T, K>
 */
export type CreateAssignmentDto = Omit<Assignment, 'id' | 'createdAt' | 'isCompleted'>;

/**
 * DTO khi cập nhật bài tập: bắt buộc có id (Pick), các trường còn lại là tùy chọn (Partial & Omit)
 * Thể hiện: Pick<T, K> kết hợp Partial<T> và Omit<T, K>
 */
export type UpdateAssignmentDto = Pick<Assignment, 'id'> & Partial<Omit<Assignment, 'id'>>;

/**
 * Tóm tắt bài tập để hiển thị rút gọn
 * Thể hiện: Pick<T, K>
 */
export type AssignmentSummary = Pick<Assignment, 'id' | 'title' | 'subject' | 'dueDate' | 'priority'>;

/**
 * Bản ghi bất biến (Readonly) bảo đảm tính immutability
 * Thể hiện: Readonly<T>
 */
export type ReadonlyAssignment = Readonly<Assignment>;

/**
 * Cấu hình hiển thị theo mức độ ưu tiên
 * Thể hiện: Record<K, T>
 */
export interface PriorityMeta {
  label: string;
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  weight: number;
}

export type PriorityMap = Record<Priority, PriorityMeta>;

export const PRIORITY_CONFIG: PriorityMap = {
  low: { label: 'Thấp', color: 'default', weight: 1 },
  medium: { label: 'Trung bình', color: 'primary', weight: 2 },
  high: { label: 'Cao', color: 'warning', weight: 3 },
  urgent: { label: 'Khẩn cấp', color: 'danger', weight: 4 },
};

/**
 * Cấu hình nhãn bộ lọc
 * Thể hiện: Record<FilterStatus, string>
 */
export const FILTER_LABELS: Record<FilterStatus, string> = {
  all: 'Tất cả',
  pending: 'Chưa hoàn thành',
  overdue: 'Quá hạn',
  completed: 'Đã hoàn thành',
};

// --- 4. CUSTOM TYPE GUARDS ---

/**
 * Type guard kiểm tra một giá trị có phải là Priority hợp lệ hay không
 */
export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && (PRIORITIES as readonly string[]).includes(value);
}

/**
 * Type guard kiểm tra một giá trị có phải là FilterStatus hợp lệ hay không
 */
export function isFilterStatus(value: unknown): value is FilterStatus {
  return typeof value === 'string' && (FILTER_STATUSES as readonly string[]).includes(value);
}

/**
 * Type guard kiểm tra chuỗi ngày tháng hợp lệ
 */
export function isValidDateString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const parsed = Date.parse(value);
  return !Number.isNaN(parsed);
}

/**
 * Type guard kiểm tra cấu trúc của đối tượng Assignment
 */
export function isAssignment(value: unknown): value is Assignment {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.subject === 'string' &&
    typeof candidate.dueDate === 'string' &&
    isValidDateString(candidate.dueDate) &&
    isPriority(candidate.priority) &&
    typeof candidate.isCompleted === 'boolean' &&
    typeof candidate.createdAt === 'string'
  );
}
