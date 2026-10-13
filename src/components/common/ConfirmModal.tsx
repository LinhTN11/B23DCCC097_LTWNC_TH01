import React from 'react';
import { Button } from '@heroui/react';
import { AlertCircle, Trash2, X } from 'lucide-react';
import type { Assignment } from '../../types/assignment.types';

export interface ConfirmModalProps {
  isOpen: boolean;
  assignment: Assignment | null;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  assignment,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 text-zinc-900">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Xác nhận xoá bài tập</h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 my-3.5 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
            Bạn có chắc chắn muốn xoá bài tập <strong className="text-zinc-900">"{assignment.title}"</strong> thuộc môn <strong className="text-zinc-900">"{assignment.subject}"</strong> không?
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              Hủy
            </button>
            <Button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xác nhận xoá
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
