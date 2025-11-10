/**
 * Workflow Detail Page
 * Shows the workflow editor
 */

"use client";

import { Skeleton } from "@/components/ui/skeleton";
import WorkflowEditor from "@/features/workflow/components/WorkflowEditor";
import { useLastWorkflow } from "@/features/workflow/hooks/useLastWorkflow";
import { useWorkflow } from "@/features/workflow/hooks/useQueries";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function WorkflowPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const workflowId = params.workflowId as string;
  const { data: workflow, isLoading } = useWorkflow(workflowId);
  const { saveLastWorkflow } = useLastWorkflow(workspaceId);

  // Save as last workflow when viewing
  useEffect(() => {
    if (workflowId) {
      saveLastWorkflow(workflowId);
    }
  }, [workflowId, saveLastWorkflow]);

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Workflow not found</h2>
          <p className="text-muted-foreground">
            The workflow you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return <WorkflowEditor />;
}
