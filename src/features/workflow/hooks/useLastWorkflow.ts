/**
 * Hook for tracking last used workflow per workspace
 * Persists to localStorage
 */

"use client";

import { useState } from "react";

const STORAGE_KEY_PREFIX = "loki_last_workflow_";

export const useLastWorkflow = (workspaceId: string) => {
  const storageKey = `${STORAGE_KEY_PREFIX}${workspaceId}`;

  const [lastWorkflowId, setLastWorkflowId] = useState<string | null>(() => {
    // Initialize from localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem(storageKey);
    }
    return null;
  });

  // Save to localStorage when changed
  const saveLastWorkflow = (workflowId: string) => {
    localStorage.setItem(storageKey, workflowId);
    setLastWorkflowId(workflowId);
  };

  const clearLastWorkflow = () => {
    localStorage.removeItem(storageKey);
    setLastWorkflowId(null);
  };

  return {
    lastWorkflowId,
    saveLastWorkflow,
    clearLastWorkflow,
  };
};
