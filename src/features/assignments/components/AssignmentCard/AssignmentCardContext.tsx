import { createContext, useContext } from 'react';
import type { Assignment } from '../../../../types/assignment.types';
import type { DeadlineCountdownResult } from '../../../../hooks/useDeadlineCountdown';

/**
 * ============================================================================
 * BUỔI 2: REACT DESIGN PATTERN - COMPOUND COMPONENT CONTEXT
 * ============================================================================
 */

export interface AssignmentCardContextValue {
  assignment: Assignment;
  countdown: DeadlineCountdownResult;
  onToggleStatus: (id: string) => void;
  onDeleteRequest: (assignment: Assignment) => void;
}

export const AssignmentCardContext = createContext<AssignmentCardContextValue | null>(null);

export function useAssignmentCardContext(): AssignmentCardContextValue {
  const context = useContext(AssignmentCardContext);
  if (!context) {
    throw new Error('Các sub-component của AssignmentCard phải được đặt bên trong <AssignmentCard>');
  }
  return context;
}
