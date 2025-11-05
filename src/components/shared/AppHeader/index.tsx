"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Workflow, WorkflowStatus } from "@/types/workflow.types";
import * as React from "react";
import { HeaderActions } from "./HeaderActions";
import { WorkflowNameInput } from "./WorkflowNameInput";
import { WorkflowStatusBadge } from "./WorkflowStatusBadge";

/**
 * AppHeader Props
 * Following Interface Segregation Principle
 */
interface AppHeaderProps {
  workflow?: Workflow;
  onWorkflowNameChange?: (name: string) => void;
  onRun?: () => void;
  onPublish?: () => void;
  onSettings?: () => void;
  className?: string;
}

/**
 * AppHeader Component
 */
export function AppHeader({
  workflow,
  onWorkflowNameChange,
  onRun,
  onPublish,
  onSettings,
  className,
}: AppHeaderProps) {
  const [isRunning, setIsRunning] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);

  // Default workflow if none provided
  const defaultWorkflow: Workflow = React.useMemo(
    () => ({
      id: "default",
      name: "Untitled Workflow",
      status: WorkflowStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    []
  );

  const currentWorkflow = workflow || defaultWorkflow;

  const handleNameChange = React.useCallback(
    (name: string) => {
      onWorkflowNameChange?.(name);
      console.log("Workflow name changed to:", name);
    },
    [onWorkflowNameChange]
  );

  const handleRun = React.useCallback(async () => {
    setIsRunning(true);
    try {
      await onRun?.();
      console.log("Workflow run initiated");
    } catch (error) {
      console.error("Failed to run workflow:", error);
    } finally {
      setTimeout(() => setIsRunning(false), 2000);
    }
  }, [onRun]);

  const handlePublish = React.useCallback(async () => {
    setIsPublishing(true);
    try {
      await onPublish?.();
      console.log("Workflow published");
    } catch (error) {
      console.error("Failed to publish workflow:", error);
    } finally {
      setTimeout(() => setIsPublishing(false), 1500);
    }
  }, [onPublish]);

  // Handle settings
  const handleSettings = React.useCallback(() => {
    onSettings?.();
    console.log("Opening workflow settings");
  }, [onSettings]);

  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4",
        className
      )}
    >
      {/* Sidebar Toggle */}
      <SidebarTrigger className="-ml-1" />

      {/* Left Section: Name & Status */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <WorkflowNameInput
          initialName={currentWorkflow.name}
          onNameChange={handleNameChange}
          className="shrink min-w-0"
        />
        <WorkflowStatusBadge status={currentWorkflow.status} />
      </div>

      {/* Right Section: Actions */}
      <HeaderActions
        workflow={currentWorkflow}
        onRun={handleRun}
        onPublish={handlePublish}
        onSettings={handleSettings}
        isRunning={isRunning}
        isPublishing={isPublishing}
      />
    </header>
  );
}
