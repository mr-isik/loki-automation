import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WorkflowStatus, WORKFLOW_STATUS_CONFIG } from '@/types/workflow.types';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * WorkflowStatusBadge Props
 * Following Interface Segregation Principle
 */
interface WorkflowStatusBadgeProps {
  status: WorkflowStatus;
  showTooltip?: boolean;
  className?: string;
}

/**
 * WorkflowStatusBadge Component
 * Single Responsibility: Display workflow status with appropriate styling
 * Open/Closed: Easy to extend with new status types through configuration
 */
export const WorkflowStatusBadge: React.FC<WorkflowStatusBadgeProps> = ({
  status,
  showTooltip = true,
  className,
}) => {
  const config = WORKFLOW_STATUS_CONFIG[status];

  const badgeContent = (
    <Badge variant={config.variant} className={cn('gap-1.5', className)}>
      <Circle
        className={cn(
          'h-2 w-2',
          status === WorkflowStatus.RUNNING && 'animate-pulse fill-current'
        )}
      />
      {config.label}
    </Badge>
  );

  if (!showTooltip) {
    return badgeContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

WorkflowStatusBadge.displayName = 'WorkflowStatusBadge';
