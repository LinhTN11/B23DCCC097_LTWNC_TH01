# B23DCCC097_LTWNC_TH01

> **Học phần:** Lập trình Web Nâng cao (LTWNC)  
> **Bài thực hành:** TH01 — Student Deadline Tracker (Ứng dụng quản lý deadline bài tập cá nhân)  
> **Sinh viên:** B23DCCC097  

---

## 📌 Giới Thiệu Dự Án

**Student Deadline Tracker** là ứng dụng web quản lý bài tập và theo dõi hạn nộp cá nhân dành cho sinh viên. Ứng dụng được thiết kế tối giản theo phong cách Monochrome chuẩn HeroUI và ngôn ngữ thiết kế Apple Human Interface Guidelines (HIG), tích hợp hai chế độ xem: **Danh sách bài tập (List View)** và **Lịch bài tập chuẩn Google Calendar (Month Grid & Schedule View)**.

Dự án hiện thực trọn vẹn 100% kiến thức kỹ thuật của cả 3 buổi học và đáp ứng đầy đủ 7 yêu cầu chức năng từ đề bài.

---

## 🛠️ Công Nghệ Sử Dụng

- **Ngôn ngữ:** TypeScript 5.8+ (Strict Mode, 100% type-safe, không sử dụng `any`)
- **Thư viện UI & View:** React 19, HeroUI (`@heroui/react` & `@heroui/styles`)
- **Quản lý trạng thái:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Kiến trúc CSS:** Tailwind CSS v4, Lucide React Icons
- **Công cụ xây dựng & Kiểm tra:** Vite 6, Oxlint, TypeScript Compiler (`tsc`)

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu môi trường
- **Node.js** >= 18 (khuyến nghị Node.js 20.x hoặc mới hơn)
- **npm** >= 9.x

### Các bước thực hiện
```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Khởi chạy máy chủ phát triển (Development Server)
npm run dev

# 3. Kiểm tra chất lượng mã nguồn (Linter & Type Check)
npm run lint
npx tsc --noEmit

# 4. Đóng gói sản phẩm (Production Build)
npm run build
```

---

## 📂 Cấu Trúc Thư Mục (Feature-based Architecture)

```
LTWNC-TH01/
├── src/
│   ├── app/                               # Cấu hình Redux Store tập trung (Buổi 3)
│   │   ├── store.ts                       # configureStore với RootState & AppDispatch
│   │   └── hooks.ts                       # Typed hooks: useAppDispatch, useAppSelector
│   ├── types/
│   │   └── assignment.types.ts            # TypeScript Nâng cao: Generic, Utility Types, Type Guards (Buổi 1)
│   ├── utils/
│   │   ├── genericHelpers.ts              # Các hàm Generic thuần túy: filterItems, sortItems, groupBy (Buổi 1)
│   │   └── dateUtils.ts                   # Tiện ích tính toán độ lệch ngày, format ngày tiếng Việt
│   ├── services/
│   │   └── mockApi.ts                     # Giả lập REST API trả về dữ liệu mẫu có trễ mạng (Buổi 3 - YC7)
│   ├── hooks/                             # Custom Hooks nâng cao (Buổi 2)
│   │   ├── useDeadlineCountdown.ts        # Hook tính "Còn X ngày" / "Quá hạn Y ngày", trạng thái khẩn cấp
│   │   └── useAssignmentFilter.ts         # Hook kết hợp lọc đa trạng thái, tìm kiếm và sắp xếp
│   ├── features/
│   │   └── assignments/                   # Feature Module quản lý bài tập (Buổi 3)
│   │       ├── assignmentsSlice.ts        # Redux Slice: reducers & extraReducers
│   │       ├── assignmentsThunks.ts       # createAsyncThunk: fetchInitialAssignments
│   │       └── components/
│   │           ├── AssignmentCard/        # Compound Component Pattern (Buổi 2)
│   │           │   ├── AssignmentCard.tsx         # Root, Header, Body, Countdown, Actions, Footer
│   │           │   ├── AssignmentCardContext.tsx  # React Context cho Compound Component
│   │           │   └── index.ts
│   │           ├── AssignmentCalendar.tsx # Lịch bài tập chuẩn Google Calendar (Month Grid & Schedule)
│   │           ├── AssignmentForm.tsx     # Modal thêm bài tập tích hợp HeroUIDatePicker & Dropdown
│   │           ├── AssignmentFilters.tsx  # Thanh lọc trạng thái, tìm kiếm và HeroUIDropdown sắp xếp
│   │           └── AssignmentList.tsx     # Danh sách bài tập được bọc bởi HOC withLoading
│   ├── components/
│   │   ├── hoc/
│   │   │   └── withLoading.tsx            # Higher-Order Component Pattern với Skeleton Loader (Buổi 2)
│   │   └── common/
│   │       ├── Header.tsx                 # Header với nút tải lại API và nút thêm task hình tròn
│   │       ├── Sidebar.tsx                # Thanh điều hướng thò thụt (Collapsible Sidebar)
│   │       ├── HeroUIDropdown.tsx         # Dropdown chuẩn HeroUI với bo góc squircle
│   │       ├── HeroUIDatePicker.tsx       # DatePicker popover thông minh chống tràn
│   │       └── ConfirmModal.tsx           # Modal xác nhận xóa bài tập an toàn
│   ├── App.tsx                            # Component gốc kết nối Redux Store, Sidebar và các View
│   ├── main.tsx                           # Entrypoint bọc Provider Redux Store
│   └── index.css                          # Cấu hình Tailwind CSS v4 & HeroUI Styles
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🎯 Chi Tiết Hiện Thực Kiến Thức 3 Buổi Học

### 1. Buổi 1 — TypeScript Nâng Cao (Advanced TypeScript)
- **Generics**:
  - `ApiResponse<T>`: Chuẩn hóa phản hồi API tổng quát có trường dữ liệu `data: T`, timestamp và message.
  - `Identifiable<TId = string>`: Ràng buộc thực thể bắt buộc có trường định danh `id: TId`.
  - `FilterPredicate<T>`: Generic callback predicate phục vụ việc lọc dữ liệu.
  - `AsyncState<T>`: Trạng thái bất đồng bộ tổng quát (`idle` | `loading` | `succeeded` | `failed`).
  - `filterItems<T>(items, predicate)`: Hàm generic lọc mảng thuần khiết không làm biến đổi mảng gốc (`readonly T[]`).
  - `sortItems<T, K extends keyof T>(items, key, order)`: Hàm generic sắp xếp áp dụng kỹ thuật **Generic Constraint** `K extends keyof T`.
  - `groupBy<T, K extends PropertyKey>(items, getKey)`: Gom nhóm đối tượng generic theo thuộc tính (được áp dụng trực tiếp trong module Calendar).
- **Utility Types**:
  - `Omit<T, K>`: Định nghĩa `CreateAssignmentDto = Omit<Assignment, 'id' | 'createdAt' | 'isCompleted'>` để loại bỏ các trường tự sinh khi gửi form.
  - `Pick<T, K>` & `Partial<T>`: Định nghĩa `UpdateAssignmentDto = Pick<Assignment, 'id'> & Partial<Omit<Assignment, 'id'>>`.
  - `Pick<T, K>`: Định nghĩa `AssignmentSummary = Pick<Assignment, 'id' | 'title' | 'subject' | 'dueDate' | 'priority'>`.
  - `Record<K, T>`: Định nghĩa `PriorityMap = Record<Priority, PriorityMeta>` và `FILTER_LABELS = Record<FilterStatus, string>`.
  - `Readonly<T>`: Định nghĩa `ReadonlyAssignment = Readonly<Assignment>`.
- **Custom Type Guards** (sử dụng kiểu đầu vào an toàn `unknown`):
  - `isPriority(value: unknown): value is Priority`
  - `isFilterStatus(value: unknown): value is FilterStatus`
  - `isValidDateString(value: unknown): value is string`
  - `isAssignment(value: unknown): value is Assignment` (Composite Type Guard kiểm định toàn diện cấu trúc object).
- **Type Safety:** Tuân thủ Strict Mode của TypeScript, tuyệt đối không sử dụng kiểu `any` lỏng lẻo trong toàn bộ dự án (`0 any`).

---

### 2. Buổi 2 — React Design Patterns & HeroUI
- **Custom Hooks Nâng Cao**:
  - `useDeadlineCountdown(dueDate, isCompleted)`: Chuẩn hóa mốc thời gian về `00:00:00` để tính chênh lệch ngày tuyệt đối, phân loại trạng thái khẩn cấp (`overdue`, `today`, `near`, `comfortable`), tối ưu hóa render qua `useMemo`.
  - `useAssignmentFilter(assignments, filterStatus, searchQuery, sortBy)`: Tích hợp thống kê số liệu tổng hợp, lọc đa tiêu chí và sắp xếp qua generic `sortItems`.
- **React Design Patterns (Áp dụng đầy đủ cả 2 mẫu thiết kế)**:
  - **Compound Component Pattern** (`AssignmentCard`):
    - Chia nhỏ cấu trúc thẻ bài tập thành các component con: `AssignmentCard.Header`, `AssignmentCard.Body`, `AssignmentCard.Countdown`, `AssignmentCard.Actions`, `AssignmentCard.Footer`.
    - Chia sẻ state và action handlers đồng bộ qua `AssignmentCardContext`. Hỗ trợ cả Custom Composition linh hoạt lẫn Default Composition tiện dụng.
  - **Higher-Order Component Pattern (HOC)** (`withLoading`):
    - Khai báo chuẩn TypeScript: `withLoading<P extends object>(WrappedComponent: React.ComponentType<P>)`.
    - Khi `isLoading: true`, tự động hiển thị **Skeleton Screen 3 thẻ card** nhấp nháy (`animate-pulse`) kèm Spinner mượt mà.
- **Thư viện HeroUI & Thiết kế Giao diện**:
  - Giao diện đen trắng tối giản (Monochrome) nguyên bản của HeroUI, viền mảnh `zinc-200`, bo góc squircle chuẩn Apple.
  - Thành phần tự xây dựng chuẩn HeroUI:
    - `HeroUIDropdown`: Dropdown chọn sắp xếp / độ ưu tiên với bo góc `rounded-xl`, popover nổi có checkmark.
    - `HeroUIDatePicker`: Lịch chọn ngày popover có phím tắt thông minh (Hôm nay, Ngày mai, +3 ngày, +1 tuần), tự động đảo chiều tránh bị che khuất.
    - `Sidebar`: Thanh điều hướng thò thụt (Collapsible), khi thu gọn logo đổi thành nút mở khi hover, các nút chức năng chuẩn hình vuông bo góc.
    - `AssignmentCalendar`: Lịch bài tập chuẩn phong cách Google Calendar với chế độ Lưới tháng (Month Grid) và Lịch trình (Schedule View).

---

### 3. Buổi 3 — Redux Toolkit + TypeScript
- **Cấu trúc Feature-based:** Tách bạch tầng cấu hình toàn cục (`src/app/store.ts`, `src/app/hooks.ts`) và tầng tính năng (`src/features/assignments/`).
- **Typed Hooks:**
  - `useAppDispatch`: Typed dispatch đảm bảo dispatch async thunk an toàn kiểu dữ liệu.
  - `useAppSelector`: Typed selector bảo đảm gợi ý thuộc tính `RootState` chính xác 100%.
- **Async Thunk (`createAsyncThunk`):**
  - `fetchInitialAssignments`: Tải danh sách bài tập mẫu ban đầu từ Mock API với độ trễ mạng giả lập 700ms.
  - `extraReducers`: Áp dụng cú pháp chuẩn **Builder Callback Notation** (`builder.addCase(...)`) xử lý trọn vẹn 3 trạng thái bất đồng bộ: `pending`, `fulfilled`, và `rejected`.

---

## 📋 Đối Chiếu 7 Yêu Cầu Chức Năng Đề Bài

| STT | Yêu cầu đề bài | Cách thức hiện thực trong dự án | Trạng thái |
| :---: | :--- | :--- | :---: |
| **YC1** | **Hiển thị danh sách bài tập**<br>(môn học, tên, hạn nộp, độ ưu tiên, trạng thái) | Hiển thị đầy đủ 5 trường thông tin trong `AssignmentCard` qua cấu trúc Compound Component, ngày format chuẩn `dd/mm/yyyy`, tag độ ưu tiên, đếm ngược hạn nộp. Hỗ trợ hiển thị trên cả dạng Danh sách và Lịch tháng Google Calendar. | **Hoàn thành 100%** |
| **YC2** | **Thêm bài tập mới qua form**<br>(môn học, tên, hạn nộp, độ ưu tiên) | Form trong modal `AssignmentForm` có validate bắt buộc, kiểm tra type guard `isPriority`, sử dụng `CreateAssignmentDto` (Omit), tích hợp `HeroUIDatePicker` và `HeroUIDropdown`. | **Hoàn thành 100%** |
| **YC3** | **Đánh dấu hoàn thành / Bỏ đánh dấu** | Checkbox tròn chuẩn Apple Reminders cho phép toggle 2 chiều ("Đánh dấu xong" $\leftrightarrow$ "Chưa xong"). Đồng bộ ngay lập tức sang Redux Store, cập nhật style gạch ngang và trạng thái trên cả List và Calendar. | **Hoàn thành 100%** |
| **YC4** | **Xoá bài tập** | Tích hợp `ConfirmModal` xác nhận trước khi xóa để bảo vệ dữ liệu người dùng, xóa tức thì khỏi Redux store. | **Hoàn thành 100%** |
| **YC5** | **Lọc theo trạng thái**<br>(Tất cả / Chưa hoàn thành / Quá hạn / Đã hoàn thành) | Segmented control 4 trạng thái có badge đếm số lượng thời gian thực, kết hợp ô tìm kiếm môn học/tên bài và dropdown sắp xếp generic (`dueDate`, `title`, `createdAt`). | **Hoàn thành 100%** |
| **YC6** | **Hiển thị "Còn X ngày" hoặc "Quá hạn Y ngày"** | `useDeadlineCountdown` chuẩn hóa mốc ngày, hiển thị chính xác text `"Còn X ngày"`, `"Quá hạn Y ngày"`, `"Hạn nộp hôm nay"`, hoặc `"Đã hoàn thành"`. | **Hoàn thành 100%** |
| **YC7** | **Khởi động app lấy danh sách mẫu từ API giả lập** | `mockApi.ts` cung cấp 6 bài tập mẫu có ngày tháng tương đối, được tự động gọi khi app khởi chạy thông qua `createAsyncThunk` trong `useEffect`. Có nút "Tải lại API" trên Header để nạp lại dữ liệu bất kỳ lúc nào. | **Hoàn thành 100%** |
