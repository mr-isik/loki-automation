/**
 * Workspace feature exports
 * Following Dependency Inversion Principle
 */

// Types
export * from "./types/navigation.types";
export * from "./types/workspace.types";

// Hooks
export { useNavigation } from "./hooks/useNavigation";
export { useWorkspace } from "./hooks/useWorkspace";

// Components
export { Navigation } from "./components/Navigation";
export { WorkspaceSwitcher } from "./components/WorkspaceSwitcher";

// Data
export { mockWorkspaces } from "./data/mockWorkspaces";
export { navigationGroups } from "./data/navigationItems";
