import { apiClient } from "@/lib/api";
import {
  CreateWorkflowEdgeRequest,
  createWorkflowEdgeRequestSchema,
  CreateWorkflowNodeRequest,
  nodeTemplatesResponseSchema,
  UpdateWorkflowEdgeRequest,
  UpdateWorkflowNodeRequest,
  workflowEdgeResponseSchema,
  workflowNodeResponseSchema,
  workflowNodesResponseSchema,
} from "../validation";
import { workflowEdgesResponseSchema } from "./../validation/index";

export const nodeAPI = {
  getNodeTemplates: async () => {
    const { data, error } = await apiClient.get(
      "/node-templates",
      {},
      nodeTemplatesResponseSchema
    );

    return { data, error };
  },

  createWorkflowNode: async (payload: CreateWorkflowNodeRequest) => {
    const { data, error } = await apiClient.post("/workflow-nodes", payload, {
      response: workflowNodeResponseSchema,
    });

    return { data, error };
  },

  updateWorkflowNode: async (
    nodeId: string,
    payload: UpdateWorkflowNodeRequest
  ) => {
    const { data, error } = await apiClient.put(
      `/workflow-nodes/${nodeId}`,
      payload
    );

    return { data, error };
  },

  deleteWorkflowNode: async (nodeId: string) => {
    const { data, error } = await apiClient.delete(`/workflow-nodes/${nodeId}`);

    return { data, error };
  },

  getWorkflowNodes: async (workflowId: string) => {
    const { data, error } = await apiClient.get(
      `/workflows/${workflowId}/nodes`,
      {},
      workflowNodesResponseSchema
    );
    return { data, error };
  },

  /* Edges */
  createWorkflowEdge: async (payload: CreateWorkflowEdgeRequest) => {
    const { data, error } = await apiClient.post("/workflow-edges", payload, {
      request: createWorkflowEdgeRequestSchema,
      response: workflowEdgeResponseSchema,
    });

    return { data, error };
  },

  updateWorkflowEdge: async (
    edgeId: string,
    payload: UpdateWorkflowEdgeRequest
  ) => {
    const { data, error } = await apiClient.patch(
      `/workflow-edges/${edgeId}`,
      payload,
      {
        response: workflowEdgeResponseSchema,
      }
    );
    return { data, error };
  },

  deleteWorkflowEdge: async (edgeId: string) => {
    const { data, error } = await apiClient.delete(`/workflow-edges/${edgeId}`);

    return { data, error };
  },

  getWorkflowEdges: async (workflowId: string) => {
    const { data, error } = await apiClient.get(
      `/workflows/${workflowId}/edges`,
      {},
      workflowEdgesResponseSchema
    );
    return { data, error };
  },
};
