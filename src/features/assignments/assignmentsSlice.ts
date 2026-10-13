import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Assignment,
  CreateAssignmentDto,
  FilterStatus,
} from '../../types/assignment.types';
import { fetchInitialAssignments } from './assignmentsThunks';

/**
 * ============================================================================
 * BUỔI 3: REDUX TOOLKIT SLICE (FEATURE-BASED STRUCTURE)
 * ============================================================================
 */

export interface AssignmentsState {
  items: Assignment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filterStatus: FilterStatus;
  searchQuery: string;
}

const initialState: AssignmentsState = {
  items: [],
  status: 'idle',
  error: null,
  filterStatus: 'all',
  searchQuery: '',
};

export const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    // Yêu cầu 2: Thêm bài tập mới qua form
    addAssignment: (state, action: PayloadAction<CreateAssignmentDto>) => {
      const newAssignment: Assignment = {
        ...action.payload,
        id: `asg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      // Thêm lên đầu danh sách
      state.items.unshift(newAssignment);
    },

    // Yêu cầu 3: Đánh dấu hoàn thành / bỏ đánh dấu
    toggleAssignmentStatus: (state, action: PayloadAction<string>) => {
      const assignment = state.items.find((item) => item.id === action.payload);
      if (assignment) {
        assignment.isCompleted = !assignment.isCompleted;
      }
    },

    // Yêu cầu 4: Xoá bài tập
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // Yêu cầu 5: Lọc theo trạng thái
    setFilterStatus: (state, action: PayloadAction<FilterStatus>) => {
      state.filterStatus = action.payload;
    },

    // Tìm kiếm bài tập
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Yêu cầu 7: Khi khởi động app, lấy danh sách mẫu ban đầu từ 1 API giả lập
    builder
      .addCase(fetchInitialAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInitialAssignments.fulfilled, (state, action: PayloadAction<Assignment[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchInitialAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Đã xảy ra lỗi khi tải dữ liệu';
      });
  },
});

export const {
  addAssignment,
  toggleAssignmentStatus,
  deleteAssignment,
  setFilterStatus,
  setSearchQuery,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
