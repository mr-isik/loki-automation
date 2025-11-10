/**
 * Workflows List Page
 * Display all workflows for the current workspace
 */

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLastWorkflow } from "@/features/workflow/hooks/useLastWorkflow";
import {
  useCreateWorkflow,
  useWorkflows,
} from "@/features/workflow/hooks/useQueries";
import { Clock, PlayCircle, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function WorkflowsPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const { data: workflows, isLoading } = useWorkflows(workspaceId);
  const { mutate: createWorkflow, isPending } = useCreateWorkflow();
  const { saveLastWorkflow } = useLastWorkflow(workspaceId);
  const [creatingWorkflow, setCreatingWorkflow] = useState(false);

  const handleCreateWorkflow = () => {
    setCreatingWorkflow(true);
    createWorkflow(
      {
        workspaceId,
        title: `Untitled Workflow`,
      },
      {
        onSuccess: () => {
          toast.success("Workflow created successfully");
          setCreatingWorkflow(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create workflow");
          setCreatingWorkflow(false);
        },
      }
    );
  };

  const handleOpenWorkflow = (workflowId: string) => {
    saveLastWorkflow(workflowId);
    router.push(`/workspace/${workspaceId}/workflow/${workflowId}`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workflows</h1>
            <p className="text-muted-foreground mt-1">
              Manage your automation workflows
            </p>
          </div>
          <Button
            onClick={handleCreateWorkflow}
            disabled={isPending || creatingWorkflow}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </div>

        {/* Workflows Grid */}
        {!workflows || workflows.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <PlayCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No workflows yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Get started by creating your first workflow to automate your
                tasks.
              </p>
              <Button
                onClick={handleCreateWorkflow}
                disabled={isPending || creatingWorkflow}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Workflow
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleOpenWorkflow(workflow.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{workflow.title}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        workflow.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {workflow.status}
                    </span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    Updated {new Date(workflow.updated_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(workflow.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
