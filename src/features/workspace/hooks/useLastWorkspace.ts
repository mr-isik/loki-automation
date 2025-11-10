/**
 * Hook for tracking last used workspace
 * Persists to localStorage
 */

"use client";

import { useState } from "react";

const STORAGE_KEY = "loki_last_workspace_id";

export const useLastWorkspace = () => {
  const [lastWorkspaceId, setLastWorkspaceId] = useState<string | null>(() => {
    // Initialize from localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY);
    }
    return null;
  });

  // Save to localStorage when changed
  const saveLastWorkspace = (workspaceId: string) => {
    localStorage.setItem(STORAGE_KEY, workspaceId);
    setLastWorkspaceId(workspaceId);
  };

  const clearLastWorkspace = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLastWorkspaceId(null);
  };

  return {
    lastWorkspaceId,
    saveLastWorkspace,
    clearLastWorkspace,
  };
};
