import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';

/**
 * ============================================================================
 * BUỔI 3: TYPED HOOKS (REDUX TOOLKIT + TYPESCRIPT)
 * Định nghĩa useAppDispatch và useAppSelector chuẩn type an toàn tuyệt đối
 * ============================================================================
 */

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
