import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockAssignmentApi } from '../../services/mockApi';
import type { Assignment } from '../../types/assignment.types';

/**
 * ============================================================================
 * BUỔI 3: REDUX TOOLKIT + TYPESCRIPT (ASYNC THUNK)
 * createAsyncThunk kết hợp TypeScript với đầy đủ types cho Payload & Error
 * ============================================================================
 */

export const fetchInitialAssignments = createAsyncThunk<
  Assignment[], // Kiểu dữ liệu trả về khi fulfilled
  void,         // Kiểu tham số đầu vào của thunk
  { rejectValue: string } // Kiểu reject value
>('assignments/fetchInitial', async (_, { rejectWithValue }) => {
  try {
    const response = await mockAssignmentApi.getInitialAssignments();
    if (!response.success) {
      return rejectWithValue(response.message || 'Lỗi không xác định khi tải dữ liệu');
    }
    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi kết nối máy chủ giả lập';
    return rejectWithValue(message);
  }
});
