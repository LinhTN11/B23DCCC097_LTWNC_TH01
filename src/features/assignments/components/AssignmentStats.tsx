import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, BookCheck } from 'lucide-react';
import type { AssignmentStats as StatsType } from '../../../hooks/useAssignmentFilter';

export interface AssignmentStatsProps {
  stats: StatsType;
}

export const AssignmentStats: React.FC<AssignmentStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-2">
      {/* 1. Tổng số bài */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng bài tập</p>
          <p className="text-2xl font-black text-slate-800 mt-0.5">{stats.total}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center text-indigo-600">
          <BookCheck className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Chưa hoàn thành */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chưa xong</p>
          <p className="text-2xl font-black text-blue-600 mt-0.5">{stats.pending}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/60 flex items-center justify-center text-blue-600">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Quá hạn */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quá hạn</p>
          <p className="text-2xl font-black text-rose-600 mt-0.5">{stats.overdue}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100/60 flex items-center justify-center text-rose-600">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      {/* 4. Đã hoàn thành */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hoàn thành</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-emerald-600">{stats.completed}</span>
            <span className="text-xs text-emerald-700 font-semibold">({stats.completionRate}%)</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/60 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
