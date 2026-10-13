/**
 * Tiện ích xử lý và tính toán ngày tháng
 */

/**
 * Tính số ngày chênh lệch giữa ngày đến hạn và thời điểm hiện tại
 * Kết quả âm (< 0): Quá hạn
 * Kết quả = 0: Hôm nay
 * Kết quả dương (> 0): Còn X ngày
 */
export function calculateDateDiffInDays(dueDateString: string): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [year, month, day] = dueDateString.split('-').map(Number);
  const target = new Date(year, month - 1, day);

  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Định dạng ngày theo chuẩn hiển thị dd/mm/yyyy
 */
export function formatDisplayDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Lấy chuỗi ngày hôm nay định dạng tiếng Việt
 */
export function getTodayFormattedVi(): string {
  const now = new Date();
  return now.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
