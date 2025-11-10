/**
 * Navigation items configuration
 * Following Open/Closed Principle - easy to extend
 */

import { FileText, Home, Play, Settings, Workflow } from "lucide-react";
import { NavigationGroup } from "../types/navigation.types";

export const getNavigationGroups = (
  workspaceId?: string
): NavigationGroup[] => [
  {
    id: "main",
    items: [
      {
        id: "home",
        label: "Home",
        icon: Home,
        href: workspaceId ? `/workspace/${workspaceId}` : "/workspace",
      },
      {
        id: "workflows",
        label: "Workflows",
        icon: Workflow,
        href: workspaceId
          ? `/workspace/${workspaceId}/workflows`
          : "/workflows",
      },
      {
        id: "runs",
        label: "Runs",
        icon: Play,
        href: workspaceId ? `/workspace/${workspaceId}/runs` : "/runs",
        badge: 3,
      },
      {
        id: "logs",
        label: "Logs",
        icon: FileText,
        href: workspaceId ? `/workspace/${workspaceId}/logs` : "/logs",
      },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    items: [
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        href: workspaceId ? `/workspace/${workspaceId}/settings` : "/settings",
      },
    ],
  },
];
