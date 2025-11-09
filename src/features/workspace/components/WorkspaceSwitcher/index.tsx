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
import { Check, ChevronDown, Plus } from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspace";

export const WorkspaceSwitcher = () => {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();

  return (
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
                    backgroundColor: currentWorkspace?.color || "#6B7280",
                  }}
                >
                  {currentWorkspace?.name.charAt(0).toUpperCase() || "W"}
                </div>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="text-sm font-semibold truncate w-full">
                    {currentWorkspace?.name || "Select Workspace"}
                  </span>
                  {currentWorkspace?.description && (
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {currentWorkspace.description}
                    </span>
                  )}
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
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => setCurrentWorkspace(workspace)}
                className="gap-3 cursor-pointer"
              >
                <div
                  className="flex h-6 w-6 items-center justify-center rounded text-white font-semibold text-xs shrink-0"
                  style={{ backgroundColor: workspace.color }}
                >
                  {workspace.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">
                    {workspace.name}
                  </span>
                  {workspace.description && (
                    <span className="text-xs text-muted-foreground truncate">
                      {workspace.description}
                    </span>
                  )}
                </div>
                {currentWorkspace?.id === workspace.id && (
                  <Check className="h-4 w-4 shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-3 cursor-pointer text-muted-foreground">
              <Plus className="h-4 w-4" />
              <span>Create Workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
