/**
 * Workspace management hook
 * Following Single Responsibility Principle
 */

import { useCallback, useState } from "react";
import { mockWorkspaces } from "../data/mockWorkspaces";
import { Workspace } from "../types/workspace.types";

export const useWorkspace = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    mockWorkspaces[0]
  );

  const createWorkspace = useCallback(
    (workspace: Omit<Workspace, "id" | "createdAt" | "updatedAt">) => {
      const newWorkspace: Workspace = {
        ...workspace,
        id: `ws-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setWorkspaces((prev) => [...prev, newWorkspace]);
    },
    []
  );

  const updateWorkspace = useCallback(
    (id: string, updates: Partial<Workspace>) => {
      setWorkspaces((prev) =>
        prev.map((ws) =>
          ws.id === id ? { ...ws, ...updates, updatedAt: new Date() } : ws
        )
      );
    },
    []
  );

  const deleteWorkspace = useCallback((id: string) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== id));
  }, []);

  return {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  };
};
