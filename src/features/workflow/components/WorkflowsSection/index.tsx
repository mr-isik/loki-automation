/**
 * Workflows Section Component
 * Displays workflows for the current workspace in sidebar
 */

"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { useLastWorkflow } from "@/features/workflow/hooks/useLastWorkflow";
import {
  useCreateWorkflow,
  useWorkflows,
} from "@/features/workflow/hooks/useQueries";
import { FileText, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function WorkflowsSection() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const workflowId = params.workflowId as string;
  const { data: workflows, isLoading } = useWorkflows(workspaceId);
  const { mutate: createWorkflow } = useCreateWorkflow();
  const { saveLastWorkflow } = useLastWorkflow(workspaceId || "");
  const [isCreating, setIsCreating] = useState(false);

  // Only show if we're in a workspace route
  if (!workspaceId) return null;

  const handleCreateWorkflow = () => {
    setIsCreating(true);
    createWorkflow(
      {
        workspaceId,
        title: `Workflow ${(workflows?.length || 0) + 1}`,
      },
      {
        onSuccess: () => {
          toast.success("Workflow created successfully");
          setIsCreating(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create workflow");
          setIsCreating(false);
        },
      }
    );
  };

  const handleOpenWorkflow = (id: string) => {
    saveLastWorkflow(id);
    router.push(`/workspace/${workspaceId}/workflow/${id}`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>Workflows</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0"
          onClick={handleCreateWorkflow}
          disabled={isCreating}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading ? (
            <>
              <SidebarMenuSkeleton />
              <SidebarMenuSkeleton />
              <SidebarMenuSkeleton />
            </>
          ) : !workflows || workflows.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
              No workflows yet
            </div>
          ) : (
            workflows.map((workflow) => (
              <SidebarMenuItem key={workflow.id}>
                <SidebarMenuButton
                  onClick={() => handleOpenWorkflow(workflow.id)}
                  isActive={workflowId === workflow.id}
                  tooltip={workflow.title}
                >
                  <FileText className="h-4 w-4" />
                  <span className="truncate">{workflow.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
