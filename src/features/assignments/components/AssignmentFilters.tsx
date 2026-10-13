import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import type { FilterStatus } from '../../../types/assignment.types';
import { FILTER_LABELS } from '../../../types/assignment.types';
import type { AssignmentStats, SortField } from '../../../hooks/useAssignmentFilter';
import { HeroUIDropdown, type DropdownOption } from '../../../components/common/HeroUIDropdown';

/**
 * ============================================================================
 * YÊU CẦU 5: LỌC THEO TRẠNG THÁI & TÌM KIẾM & SẮP XẾP
 * Phong cách đen trắng (Monochrome) tối giản chuẩn HeroUI & Apple Human Interface
 * Tích hợp HeroUIDropdown cho bộ chọn sắp xếp
 * ============================================================================
 */

export interface AssignmentFiltersProps {
  currentFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortField;
  onSortChange: (field: SortField) => void;
  stats: AssignmentStats;
}

const SORT_OPTIONS: DropdownOption<SortField>[] = [
  { value: 'dueDate', label: 'Xếp theo Hạn nộp' },
  { value: 'title', label: 'Xếp theo Tên A-Z' },
  { value: 'createdAt', label: 'Xếp theo Mới tạo' },
];

export const AssignmentFilters: React.FC<AssignmentFiltersProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  stats,
}) => {
  const filterOptions: { key: FilterStatus; count: number }[] = [
    { key: 'all', count: stats.total },
    { key: 'pending', count: stats.pending },
    { key: 'overdue', count: stats.overdue },
    { key: 'completed', count: stats.completed },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 py-1">
      {/* 1. Bộ lọc trạng thái Segmented Control đen trắng HeroUI */}
      <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200 overflow-x-auto scrollbar-none">
        {filterOptions.map(({ key, count }) => {
          const isActive = currentFilter === key;
          const label = FILTER_LABELS[key];

          return (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange(key)}
              className={`cursor-pointer whitespace-nowrap px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              <span>{label}</span>
              <span
                className={`ml-1.5 text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                  isActive ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Nhóm Tìm kiếm & HeroUIDropdown Sắp xếp */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Ô tìm kiếm nhanh với Apple Squircle rounded-xl */}
        <div className="relative flex-1 sm:w-60">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm môn học, bài tập..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 bg-white focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 placeholder:text-zinc-400 transition-all shadow-2xs"
          />
        </div>

        {/* Dropdown Sắp xếp phong cách HeroUI */}
        <HeroUIDropdown<SortField>
          value={sortBy}
          options={SORT_OPTIONS}
          onChange={onSortChange}
          icon={<ArrowUpDown className="w-3.5 h-3.5" />}
          className="shrink-0"
        />
      </div>
    </div>
  );
};
