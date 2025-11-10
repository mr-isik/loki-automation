/**
 * Workspace page - redirects to last workflow
 */

"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useLastWorkflow } from "@/features/workflow/hooks/useLastWorkflow";
import { useWorkflows } from "@/features/workflow/hooks/useQueries";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const { data: workflows, isLoading } = useWorkflows(workspaceId);
  const { lastWorkflowId } = useLastWorkflow(workspaceId);

  useEffect(() => {
    if (isLoading) return;

    if (!workflows || workflows.length === 0) {
      // No workflows, redirect to workflows list to create one
      router.push(`/workspace/${workspaceId}/workflows`);
      return;
    }

    // If we have a last workflow ID and it exists
    if (lastWorkflowId) {
      const workflowExists = workflows.some((w) => w.id === lastWorkflowId);
      if (workflowExists) {
        router.push(`/workspace/${workspaceId}/workflow/${lastWorkflowId}`);
        return;
      }
    }

    // Otherwise, redirect to first workflow
    router.push(`/workspace/${workspaceId}/workflow/${workflows[0].id}`);
  }, [workflows, isLoading, lastWorkflowId, workspaceId, router]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}
