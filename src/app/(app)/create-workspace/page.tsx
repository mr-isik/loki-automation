/**
 * Create Workspace Page
 * Standalone page for workspace creation
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkspaceForm } from "@/features/workspace/components/CreateWorkspaceForm";
import { useCreateWorkspace } from "@/features/workspace/hooks/useQueries";
import { CreateWorkspaceFormData } from "@/features/workspace/validation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateWorkspacePage() {
  const router = useRouter();
  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const handleSubmit = (data: CreateWorkspaceFormData) => {
    createWorkspace(data, {
      onSuccess: () => {
        toast.success("Workspace created successfully");
        router.push("/");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create workspace");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your First Workspace</CardTitle>
          <CardDescription>
            Get started by creating a workspace to organize your workflows and
            team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateWorkspaceForm
            onSubmit={handleSubmit}
            isPending={isPending}
            submitLabel="Get Started"
          />
        </CardContent>
      </Card>
    </div>
  );
}
