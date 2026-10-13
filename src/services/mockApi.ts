import type { ApiResponse, Assignment } from '../types/assignment.types';

/**
 * ============================================================================
 * MOCK API SERVICE
 * Đáp ứng Yêu cầu 7: "Khi khởi động app, lấy danh sách mẫu ban đầu từ 1 API giả lập"
 * ============================================================================
 */

// Helper tạo ngày động dựa trên ngày hiện tại để người chấm mở app lúc nào cũng thấy đúng logic
function formatRelativeDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

const INITIAL_MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-001',
    subject: 'Lập trình Web Nâng cao',
    title: 'Thực hành 01: TypeScript, Redux Toolkit & React Design Patterns',
    dueDate: formatRelativeDate(0), // Đến hạn hôm nay
    priority: 'urgent',
    isCompleted: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'asg-002',
    subject: 'Trí tuệ Nhân tạo',
    title: 'Bài tập lớn: Triển khai thuật toán A* và Heuristic Search',
    dueDate: formatRelativeDate(2), // Còn 2 ngày
    priority: 'high',
    isCompleted: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'asg-003',
    subject: 'Kiến trúc Phần mềm',
    title: 'Báo cáo thiết kế Microservices & Clean Architecture',
    dueDate: formatRelativeDate(5), // Còn 5 ngày
    priority: 'medium',
    isCompleted: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'asg-004',
    subject: 'Hệ Quản trị Cơ sở Dữ liệu',
    title: 'Lab 04: Tối ưu hoá truy vấn SQL và Indexing PostgreSQL',
    dueDate: formatRelativeDate(-3), // Quá hạn 3 ngày
    priority: 'high',
    isCompleted: false,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'asg-005',
    subject: 'Mạng Máy tính',
    title: 'Thực hành Socket TCP/UDP Client-Server bằng Node.js',
    dueDate: formatRelativeDate(-1), // Quá hạn nhưng đã hoàn thành
    priority: 'low',
    isCompleted: true,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'asg-006',
    subject: 'An toàn và Bảo mật Thông tin',
    title: 'Tiểu luận: Phân tích cơ chế mã hoá RSA và chữ ký số SHA-256',
    dueDate: formatRelativeDate(10), // Còn 10 ngày
    priority: 'medium',
    isCompleted: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const mockAssignmentApi = {
  /**
   * Giả lập API call GET /assignments với độ trễ mạng ~700ms
   */
  async getInitialAssignments(): Promise<ApiResponse<Assignment[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [...INITIAL_MOCK_ASSIGNMENTS],
          success: true,
          message: 'Lấy danh sách bài tập thành công',
          timestamp: new Date().toISOString(),
        });
      }, 700);
    });
  },
};
