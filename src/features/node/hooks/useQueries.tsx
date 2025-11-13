/**
 * React Query hooks for node and edge operations
 * Following Single Responsibility Principle - Each hook has one purpose
 * Following Interface Segregation Principle - Hooks provide only what's needed
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { nodeAPI } from "../api";
import {
  CreateWorkflowEdgeRequest,
  CreateWorkflowNodeRequest,
  UpdateWorkflowEdgeRequest,
  UpdateWorkflowNodeRequest,
} from "../validation";

// Query Keys - Following Open/Closed Principle
export const nodeKeys = {
  all: ["nodes"] as const,
  templates: () => [...nodeKeys.all, "templates"] as const,
  workflowNodes: (workflowId: string) =>
    [...nodeKeys.all, "workflow", workflowId] as const,
  workflowEdges: (workflowId: string) =>
    ["edges", "workflow", workflowId] as const,
};

/**
 * Fetch node templates
 * Used for node palette/sidebar
 */
export const useNodeTemplates = () => {
  return useQuery({
    queryKey: nodeKeys.templates(),
    queryFn: async () => {
      const { data, error } = await nodeAPI.getNodeTemplates();
      if (error || !data) {
        throw new Error(error?.message || "Failed to fetch node templates");
      }
      return data;
    },
  });
};

/**
 * Fetch workflow nodes
 * Following Dependency Inversion - Depends on workflowId, not concrete implementation
 */
export const useWorkflowNodes = (workflowId: string) => {
  return useQuery({
    queryKey: nodeKeys.workflowNodes(workflowId),
    queryFn: async () => {
      const { data, error } = await nodeAPI.getWorkflowNodes(workflowId);
      if (error || !data) {
        throw new Error(error?.message || "Failed to fetch workflow nodes");
      }
      return data.nodes;
    },
    enabled: !!workflowId,
  });
};

/**
 * Fetch workflow edges
 */
export const useWorkflowEdges = (workflowId: string) => {
  return useQuery({
    queryKey: nodeKeys.workflowEdges(workflowId),
    queryFn: async () => {
      const { data, error } = await nodeAPI.getWorkflowEdges(workflowId);
      if (error || !data) {
        throw new Error(error?.message || "Failed to fetch workflow edges");
      }
      return data.edges;
    },
    enabled: !!workflowId,
  });
};

/**
 * Create workflow node
 * Following Single Responsibility - Only creates nodes
 * Performance: No auto-invalidation, component handles state updates
 */
export const useCreateWorkflowNode = () => {
  return useMutation({
    mutationFn: async (payload: CreateWorkflowNodeRequest) => {
      const { data, error } = await nodeAPI.createWorkflowNode(payload);
      if (error) {
        throw new Error(error?.message || "Failed to create workflow node");
      }
      return data;
    },
  });
};

/**
 * Update workflow node
 * Performance: No auto-invalidation, using local state in component
 */
export const useUpdateWorkflowNode = () => {
  return useMutation({
    mutationFn: async ({
      nodeId,
      payload,
    }: {
      nodeId: string;
      payload: UpdateWorkflowNodeRequest;
      workflowId: string;
    }) => {
      const { data, error } = await nodeAPI.updateWorkflowNode(nodeId, payload);
      if (error) {
        throw new Error(error?.message || "Failed to update workflow node");
      }
      return data;
    },
  });
};

/**
 * Delete workflow node
 * Performance: No auto-invalidation, using local state in component
 */
export const useDeleteWorkflowNode = () => {
  return useMutation({
    mutationFn: async ({ nodeId }: { nodeId: string; workflowId: string }) => {
      const { data, error } = await nodeAPI.deleteWorkflowNode(nodeId);
      if (error) {
        throw new Error(error?.message || "Failed to delete workflow node");
      }
      return data;
    },
  });
};

/**
 * Create workflow edge
 * Performance: No auto-invalidation, using optimistic updates in component
 */
export const useCreateWorkflowEdge = () => {
  return useMutation({
    mutationFn: async ({ payload }: { payload: CreateWorkflowEdgeRequest }) => {
      const { data, error } = await nodeAPI.createWorkflowEdge(payload);
      if (error) {
        throw new Error(error?.message || "Failed to create workflow edge");
      }
      return data;
    },
  });
};

/**
 * Update workflow edge
 * Performance: No auto-invalidation, using local state in component
 */
export const useUpdateWorkflowEdge = () => {
  return useMutation({
    mutationFn: async ({
      edgeId,
      payload,
    }: {
      edgeId: string;
      payload: UpdateWorkflowEdgeRequest;
      workflowId: string;
    }) => {
      const { data, error } = await nodeAPI.updateWorkflowEdge(edgeId, payload);
      if (error) {
        throw new Error(error?.message || "Failed to update workflow edge");
      }
      return data;
    },
  });
};

/**
 * Delete workflow edge
 * Performance: No auto-invalidation, using local state in component
 */
export const useDeleteWorkflowEdge = () => {
  return useMutation({
    mutationFn: async ({ edgeId }: { edgeId: string; workflowId: string }) => {
      const { data, error } = await nodeAPI.deleteWorkflowEdge(edgeId);
      if (error) {
        throw new Error(error?.message || "Failed to delete workflow edge");
      }
      return data;
    },
  });
};
