/* oxlint-disable react/only-export-components */
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@heroui/react';
import { Calendar, Trash2, CheckCircle2, Circle, AlertCircle, Clock } from 'lucide-react';
import type { Assignment } from '../../../../types/assignment.types';
import { PRIORITY_CONFIG } from '../../../../types/assignment.types';
import { useDeadlineCountdown } from '../../../../hooks/useDeadlineCountdown';
import {
  AssignmentCardContext,
  useAssignmentCardContext,
} from './AssignmentCardContext';

/**
 * ============================================================================
 * BUỔI 2: REACT DESIGN PATTERN - COMPOUND COMPONENT PATTERN
 * Phong cách đen trắng (Monochrome) tối giản nguyên bản của HeroUI
 * Không sử dụng màu nền lòe loẹt, giữ thiết kế sắc nét, thanh lịch
 * ============================================================================
 */

export interface AssignmentCardProps {
  assignment: Assignment;
  onToggleStatus: (id: string) => void;
  onDeleteRequest: (assignment: Assignment) => void;
  children?: React.ReactNode;
}

// 1. Root Component
export const AssignmentCardRoot: React.FC<AssignmentCardProps> = ({
  assignment,
  onToggleStatus,
  onDeleteRequest,
  children,
}) => {
  const countdown = useDeadlineCountdown(assignment.dueDate, assignment.isCompleted);

  return (
    <AssignmentCardContext.Provider
      value={{
        assignment,
        countdown,
        onToggleStatus,
        onDeleteRequest,
      }}
    >
      <Card
        className={`w-full rounded-2xl border border-zinc-200 bg-white transition-all duration-150 shadow-xs hover:shadow-sm hover:border-zinc-300 flex flex-col justify-between overflow-hidden ${
          assignment.isCompleted ? 'bg-zinc-50/50 opacity-80' : ''
        }`}
      >
        {children ? (
          children
        ) : (
          <>
            <AssignmentCardHeader />
            <AssignmentCardBody />
            <AssignmentCardFooter />
          </>
        )}
      </Card>
    </AssignmentCardContext.Provider>
  );
};

// 2. Sub-component: Header (Môn học + Độ ưu tiên)
export const AssignmentCardHeader: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { assignment } = useAssignmentCardContext();
  const priorityMeta = PRIORITY_CONFIG[assignment.priority];

  return (
    <CardHeader className={`px-5 pt-4 pb-2 border-b border-zinc-100 block ${className}`}>
      <div className="flex items-center justify-between w-full gap-2">
        {/* Môn học: badge xám đen tối giản */}
        <span
          className="font-medium text-xs text-zinc-800 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-md truncate max-w-[180px]"
          title={assignment.subject}
        >
          {assignment.subject}
        </span>

        {/* Độ ưu tiên: phong cách đơn sắc thanh lịch */}
        <span
          className={`text-[11px] px-2 py-0.5 rounded-md font-medium inline-flex items-center gap-1 ${
            assignment.priority === 'urgent'
              ? 'bg-zinc-900 text-white'
              : assignment.priority === 'high'
              ? 'bg-zinc-200 text-zinc-900'
              : assignment.priority === 'medium'
              ? 'bg-zinc-100 text-zinc-700 border border-zinc-200'
              : 'text-zinc-500'
          }`}
        >
          {priorityMeta.label}
        </span>
      </div>
    </CardHeader>
  );
};

// 3. Sub-component: Body (Tên bài tập)
export const AssignmentCardBody: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { assignment } = useAssignmentCardContext();

  return (
    <CardContent className={`px-5 py-3.5 flex-1 flex flex-col justify-center ${className}`}>
      <h3
        className={`text-sm sm:text-base font-semibold leading-snug ${
          assignment.isCompleted
            ? 'line-through text-zinc-400 font-normal'
            : 'text-zinc-900'
        }`}
        title={assignment.title}
      >
        {assignment.title}
      </h3>
    </CardContent>
  );
};

// 4. Sub-component: Countdown & Due Date
export const AssignmentCardCountdown: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { assignment, countdown } = useAssignmentCardContext();

  const formattedDueDate = React.useMemo(() => {
    try {
      const [year, month, day] = assignment.dueDate.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return assignment.dueDate;
    }
  }, [assignment.dueDate]);

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 text-xs ${className}`}>
      <div className="flex items-center gap-1.5 text-zinc-500">
        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
        <span>Hạn: <span className="text-zinc-700 font-medium">{formattedDueDate}</span></span>
      </div>

      {/* Hiển thị Còn X ngày / Quá hạn Y ngày (Yêu cầu 6) */}
      <div
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          assignment.isCompleted
            ? 'bg-zinc-100 text-zinc-600 border-zinc-200'
            : countdown.isOverdue
            ? 'bg-zinc-900 text-white border-zinc-900'
            : countdown.isToday
            ? 'bg-zinc-100 text-zinc-900 border-zinc-400 font-semibold'
            : 'bg-zinc-50 text-zinc-700 border-zinc-200'
        }`}
      >
        {countdown.isOverdue && !assignment.isCompleted ? (
          <AlertCircle className="w-3 h-3 text-white" />
        ) : countdown.isToday && !assignment.isCompleted ? (
          <Clock className="w-3 h-3 text-zinc-900" />
        ) : assignment.isCompleted ? (
          <CheckCircle2 className="w-3 h-3 text-zinc-500" />
        ) : (
          <Clock className="w-3 h-3 text-zinc-400" />
        )}
        <span>{countdown.displayText}</span>
      </div>
    </div>
  );
};

// 5. Sub-component: Actions (Đánh dấu hoàn thành + Xóa)
export const AssignmentCardActions: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { assignment, onToggleStatus, onDeleteRequest } = useAssignmentCardContext();

  return (
    <div className={`flex items-center justify-between pt-2.5 border-t border-zinc-100 gap-2 ${className}`}>
      {/* Nút Đánh dấu hoàn thành / Bỏ đánh dấu (Yêu cầu 3) - Phong cách HeroUI đen trắng */}
      <button
        type="button"
        onClick={() => onToggleStatus(assignment.id)}
        className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          assignment.isCompleted
            ? 'bg-zinc-900 text-white hover:bg-zinc-800'
            : 'bg-white text-zinc-800 border border-zinc-200 hover:bg-zinc-100'
        }`}
        title={assignment.isCompleted ? 'Bấm để đánh dấu chưa xong' : 'Bấm để hoàn thành'}
      >
        {assignment.isCompleted ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>Đã xong</span>
          </>
        ) : (
          <>
            <Circle className="w-3.5 h-3.5 text-zinc-400" />
            <span>Đánh dấu xong</span>
          </>
        )}
      </button>

      {/* Nút Xoá bài tập (Yêu cầu 4) */}
      <button
        type="button"
        onClick={() => onDeleteRequest(assignment)}
        className="cursor-pointer inline-flex items-center gap-1 p-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        title="Xoá bài tập này"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

// 6. Sub-component: Footer
export const AssignmentCardFooter: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <CardFooter className={`px-5 pb-4 pt-1 flex flex-col gap-2.5 ${className}`}>
      <AssignmentCardCountdown className="w-full" />
      <AssignmentCardActions className="w-full" />
    </CardFooter>
  );
};

export const AssignmentCard = Object.assign(AssignmentCardRoot, {
  Header: AssignmentCardHeader,
  Body: AssignmentCardBody,
  Countdown: AssignmentCardCountdown,
  Actions: AssignmentCardActions,
  Footer: AssignmentCardFooter,
});
