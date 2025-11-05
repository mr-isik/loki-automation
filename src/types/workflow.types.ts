/**
 * Workflow type definitions
 * Following Single Responsibility Principle
 */

export enum WorkflowStatus {
  DRAFT = "draft",
  RUNNING = "running",
  PUBLISHED = "published",
  PAUSED = "paused",
  FAILED = "failed",
}

export interface Workflow {
  id: string;
  name: string;
  status: WorkflowStatus;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

export interface WorkflowSettings {
  autoRun: boolean;
  notifications: boolean;
  logLevel: "info" | "debug" | "error";
  retryOnFailure: boolean;
  maxRetries: number;
}

/**
 * Status configuration for styling and display
 * Following Open/Closed Principle - easy to extend with new statuses
 */
export const WORKFLOW_STATUS_CONFIG = {
  [WorkflowStatus.DRAFT]: {
    label: "Draft",
    variant: "secondary" as const,
    description: "Workflow is in draft mode",
  },
  [WorkflowStatus.RUNNING]: {
    label: "Running",
    variant: "default" as const,
    description: "Workflow is currently running",
  },
  [WorkflowStatus.PUBLISHED]: {
    label: "Published",
    variant: "default" as const,
    description: "Workflow is published and ready",
  },
  [WorkflowStatus.PAUSED]: {
    label: "Paused",
    variant: "outline" as const,
    description: "Workflow is paused",
  },
  [WorkflowStatus.FAILED]: {
    label: "Failed",
    variant: "destructive" as const,
    description: "Workflow execution failed",
  },
} as const;

/**
 * Type guards for workflow status
 * Following Interface Segregation Principle
 */
export const isRunningWorkflow = (workflow: Workflow): boolean => {
  return workflow.status === WorkflowStatus.RUNNING;
};

export const canPublishWorkflow = (workflow: Workflow): boolean => {
  return (
    workflow.status === WorkflowStatus.DRAFT ||
    workflow.status === WorkflowStatus.PAUSED
  );
};

export const canRunWorkflow = (workflow: Workflow): boolean => {
  return workflow.status !== WorkflowStatus.RUNNING;
};
