/**
 * React Query hooks for workflow operations
 * Following Single Responsibility Principle
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workflowAPI } from "../api";
import type { UpdateRequest } from "../validation";

// Query Keys
export const workflowKeys = {
  all: (workspaceId: string) => ["workflows", workspaceId] as const,
  detail: (workflowId: string) => ["workflows", "detail", workflowId] as const,
};

/**
 * Fetch all workflows for a workspace
 */
export const useWorkflows = (workspaceId: string) => {
  return useQuery({
    queryKey: workflowKeys.all(workspaceId),
    queryFn: async () => {
      const { data, success, error } = await workflowAPI.GetWorkFlows(
        workspaceId
      );
      if (!success || !data) {
        throw new Error(error?.message || "Failed to fetch workflows");
      }
      return data.data;
    },
    enabled: !!workspaceId,
  });
};

/**
 * Fetch single workflow by ID
 */
export const useWorkflow = (workflowId: string) => {
  return useQuery({
    queryKey: workflowKeys.detail(workflowId),
    queryFn: async () => {
      const { data, success, error } = await workflowAPI.GetWorkFlowById(
        workflowId
      );
      if (!success || !data) {
        throw new Error(error?.message || "Failed to fetch workflow");
      }
      return data;
    },
    enabled: !!workflowId,
  });
};

/**
 * Create new workflow
 */
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      title,
    }: {
      workspaceId: string;
      title: string;
    }) => {
      const { success, error } = await workflowAPI.CreateWorkFlow(
        workspaceId,
        title
      );
      if (!success) {
        throw new Error(error?.message || "Failed to create workflow");
      }
      return { workspaceId, title };
    },
    onSuccess: (data) => {
      // Invalidate workflows list for this workspace
      queryClient.invalidateQueries({
        queryKey: workflowKeys.all(data.workspaceId),
      });
    },
  });
};

/**
 * Update workflow
 */
export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workflowId,
      updates,
    }: {
      workflowId: string;
      updates: UpdateRequest;
    }) => {
      const { success, error } = await workflowAPI.UpdateWorkFlow(
        workflowId,
        updates
      );
      if (!success) {
        throw new Error(error?.message || "Failed to update workflow");
      }
      return workflowId;
    },
    onSuccess: (workflowId) => {
      // Invalidate both detail and list queries
      queryClient.invalidateQueries({
        queryKey: workflowKeys.detail(workflowId),
      });
      // Invalidate all workflow lists (we don't know which workspace)
      queryClient.invalidateQueries({
        queryKey: ["workflows"],
      });
    },
  });
};

/**
 * Delete workflow
 */
export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workflowId: string) => {
      const { success, error } = await workflowAPI.DeleteWorkFlow(workflowId);
      if (!success) {
        throw new Error(error?.message || "Failed to delete workflow");
      }
      return workflowId;
    },
    onSuccess: () => {
      // Invalidate all workflow lists
      queryClient.invalidateQueries({
        queryKey: ["workflows"],
      });
    },
  });
};
