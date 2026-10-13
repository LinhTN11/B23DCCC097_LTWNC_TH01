import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { X, BookOpen, AlertCircle, FileText, Check, Flag } from 'lucide-react';
import type { CreateAssignmentDto, Priority } from '../../../types/assignment.types';
import { PRIORITY_CONFIG, isPriority } from '../../../types/assignment.types';
import { HeroUIDatePicker } from '../../../components/common/HeroUIDatePicker';
import { HeroUIDropdown, type DropdownOption } from '../../../components/common/HeroUIDropdown';

/**
 * ============================================================================
 * YÊU CẦU 2: THÊM BÀI TẬP MỚI QUA FORM
 * Phong cách đen trắng tối giản nguyên bản của HeroUI & Apple Human Interface
 * Loại bỏ triệt để overflow-hidden để DatePicker và Dropdown không bao giờ bị cắt
 * ============================================================================
 */

export interface AssignmentFormProps {
  onSubmit: (dto: CreateAssignmentDto) => void;
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

const PRIORITY_OPTIONS: DropdownOption<Priority>[] = (
  Object.keys(PRIORITY_CONFIG) as Priority[]
).map((pKey) => ({
  value: pKey,
  label: PRIORITY_CONFIG[pKey].label,
  icon: <Flag className="w-3.5 h-3.5" />,
}));

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  onSubmit,
  isOpen,
  onClose,
  initialDate,
}) => {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    if (initialDate && /^\d{4}-\d{2}-\d{2}$/.test(initialDate)) {
      return initialDate;
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [priority, setPriority] = useState<Priority>('medium');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!subject.trim()) {
      newErrors.subject = 'Vui lòng nhập tên môn học';
    }
    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tên bài tập';
    }
    if (!dueDate) {
      newErrors.dueDate = 'Vui lòng chọn hạn nộp';
    }
    if (!isPriority(priority)) {
      newErrors.priority = 'Độ ưu tiên không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const dto: CreateAssignmentDto = {
      subject: subject.trim(),
      title: title.trim(),
      dueDate,
      priority,
    };

    onSubmit(dto);

    // Reset form
    setSubject('');
    setTitle('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      {/* Khung modal với overflow-visible để popover không bị cắt xén */}
      <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 w-full max-w-lg relative animate-in zoom-in-95 duration-150 my-auto">
        {/* Header - Apple Card Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between rounded-t-3xl bg-white">
          <div>
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">Thêm bài tập mới</h2>
            <p className="text-xs text-zinc-500">Nhập đầy đủ thông tin deadline để theo dõi</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Môn học */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              Môn học <span className="text-zinc-400">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: Lập trình Web Nâng cao, Cấu trúc dữ liệu..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none shadow-2xs ${
                errors.subject
                  ? 'border-zinc-900 bg-zinc-50'
                  : 'border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900'
              }`}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-zinc-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-zinc-800" /> {errors.subject}
              </p>
            )}
          </div>

          {/* Tên bài tập */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              Tên bài tập <span className="text-zinc-400">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: Bài tập thực hành 01 - React & Redux..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none shadow-2xs ${
                errors.title
                  ? 'border-zinc-900 bg-zinc-50'
                  : 'border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-zinc-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-zinc-800" /> {errors.title}
              </p>
            )}
          </div>

          {/* Hạn nộp (HeroUIDatePicker) & Độ ưu tiên (HeroUIDropdown) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
            {/* DatePicker chuẩn HeroUI Apple style */}
            <HeroUIDatePicker
              value={dueDate}
              onChange={setDueDate}
              label="Hạn nộp *"
              error={errors.dueDate}
            />

            {/* Dropdown độ ưu tiên chuẩn HeroUI */}
            <HeroUIDropdown<Priority>
              value={priority}
              options={PRIORITY_OPTIONS}
              onChange={setPriority}
              label="Độ ưu tiên"
              className="w-full"
            />
          </div>

          {/* Nút hành động */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <Button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              Lưu bài tập
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
