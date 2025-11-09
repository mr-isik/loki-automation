import { Workspace } from "../types/workspace.types";

/**
 * Mock workspace data for demonstration
 * In production, this would come from an API
 */
export const mockWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Personal Projects",
    description: "My personal automation workflows",
    icon: "User",
    color: "#FF6D5A",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "ws-2",
    name: "Team Automations",
    description: "Shared team workflows",
    icon: "Users",
    color: "#10B981",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "ws-3",
    name: "Development",
    description: "Development and testing workflows",
    icon: "Code",
    color: "#8B5CF6",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
];
