/**
 * Workspace Switcher Component
 * Following Single Responsibility Principle - handles workspace selection
 */

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ChevronDown, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useWorkspaces } from "../../hooks/useQueries";
import { useWorkspace } from "../../hooks/useWorkspace";
import { CreateWorkspaceModal } from "../CreateWorkspaceModal";

const WORKSPACE_COLORS = [
  "#6B7280",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

const getWorkspaceColor = (index: number) => {
  return WORKSPACE_COLORS[index % WORKSPACE_COLORS.length];
};

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const params = useParams();
  const currentWorkspaceId = params.workspaceId as string | undefined;
  const { currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const { data: workspaces, isLoading } = useWorkspaces();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleWorkspaceSwitch = (workspace: {
    id: string;
    name: string;
    created_at: string;
  }) => {
    setCurrentWorkspace(workspace);
    // Navigate to the new workspace
    router.push(`/workspace/${workspace.id}`);
  };

  // Determine current workspace from URL if available
  const displayWorkspace = currentWorkspaceId
    ? workspaces?.find((w) => w.id === currentWorkspaceId) || currentWorkspace
    : currentWorkspace;

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="w-full" disabled>
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex flex-col gap-1 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-semibold text-sm shrink-0"
                    style={{
                      backgroundColor:
                        getWorkspaceColor(
                          workspaces?.findIndex(
                            (w) => w.id === displayWorkspace?.id
                          ) ?? 0
                        ) || "#6B7280",
                    }}
                  >
                    {displayWorkspace?.name.charAt(0).toUpperCase() || "W"}
                  </div>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="text-sm font-semibold truncate w-full">
                      {displayWorkspace?.name || "Select Workspace"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {workspaces?.length || 0} workspace
                      {workspaces?.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 ml-auto" />
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-64"
              align="start"
              side="bottom"
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces && workspaces.length > 0 ? (
                workspaces.map((workspace, index) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onClick={() => handleWorkspaceSwitch(workspace)}
                    className="gap-3 cursor-pointer"
                  >
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded text-white font-semibold text-xs shrink-0"
                      style={{ backgroundColor: getWorkspaceColor(index) }}
                    >
                      {workspace.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">
                        {workspace.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        Created{" "}
                        {new Date(workspace.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {displayWorkspace?.id === workspace.id && (
                      <Check className="h-4 w-4 shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No workspaces found
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-3 cursor-pointer text-muted-foreground"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Create Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CreateWorkspaceModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
};
