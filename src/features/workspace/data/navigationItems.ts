/**
 * Navigation items configuration
 * Following Open/Closed Principle - easy to extend
 */

import { FileText, Home, Play, Settings, Workflow } from "lucide-react";
import { NavigationGroup } from "../types/navigation.types";

export const navigationGroups: NavigationGroup[] = [
  {
    id: "main",
    items: [
      {
        id: "home",
        label: "Home",
        icon: Home,
        href: "/app",
      },
      {
        id: "workflows",
        label: "Workflows",
        icon: Workflow,
        href: "/workflows",
      },
      {
        id: "runs",
        label: "Runs",
        icon: Play,
        href: "/runs",
        badge: 3,
      },
      {
        id: "logs",
        label: "Logs",
        icon: FileText,
        href: "/logs",
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
        href: "/settings",
      },
    ],
  },
];
