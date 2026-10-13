import type { FilterPredicate } from '../types/assignment.types';

/**
 * ============================================================================
 * GENERIC UTILITIES (BUỔI 1: TYPESCRIPT NÂNG CAO)
 * Các hàm tiện ích dùng Generics để tái sử dụng với nhiều loại dữ liệu
 * ============================================================================
 */

/**
 * Lọc mảng các phần tử kiểu T bằng predicate generic
 */
export function filterItems<T>(items: readonly T[], predicate: FilterPredicate<T>): T[] {
  return items.filter(predicate);
}

/**
 * Sắp xếp mảng kiểu T theo một thuộc tính khóa K của T
 */
export function sortItems<T, K extends keyof T>(
  items: readonly T[],
  key: K,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Gom nhóm danh sách phần tử generic T theo key
 */
export function groupBy<T, K extends PropertyKey>(
  items: readonly T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const groupKey = getKey(item);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
