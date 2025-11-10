/**
 * Root page - redirects to last workspace
 */

"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useLastWorkspace } from "@/features/workspace/hooks/useLastWorkspace";
import { useWorkspaces } from "@/features/workspace/hooks/useQueries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { data: workspaces, isLoading } = useWorkspaces();
  const { lastWorkspaceId } = useLastWorkspace();

  useEffect(() => {
    if (isLoading) return;

    if (!workspaces || workspaces.length === 0) {
      router.push("/create-workspace");
      return;
    }

    // If we have a last workspace ID and it exists
    if (lastWorkspaceId) {
      const workspaceExists = workspaces.some((w) => w.id === lastWorkspaceId);
      if (workspaceExists) {
        router.push(`/workspace/${lastWorkspaceId}`);
        return;
      }
    }

    // Otherwise, redirect to first workspace
    router.push(`/workspace/${workspaces[0].id}`);
  }, [workspaces, isLoading, lastWorkspaceId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}
