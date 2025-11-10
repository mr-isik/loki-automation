import { apiClient } from "@/lib/api";
import { PaginatedResponseSchema } from "@/lib/validation";
import {
  UpdateRequest,
  updateWorkflowRequestSchema,
  workflowResponseSchema,
} from "../validation";

export const workflowAPI = {
  async GetWorkFlows(workspaceId: string) {
    const { data, error, success } = await apiClient.get(
      `/workspaces/${workspaceId}/workflows`,
      {},
      PaginatedResponseSchema(workflowResponseSchema)
    );

    return { data, error, success };
  },

  async GetWorkFlowById(workflowId: string) {
    const { data, error, success } = await apiClient.get(
      `/workflows/${workflowId}`,
      {},
      workflowResponseSchema
    );

    return { data, error, success };
  },

  async CreateWorkFlow(workspaceId: string, title: string) {
    const { error, success } = await apiClient.post(
      `/workspaces/${workspaceId}/workflows`,
      { title }
    );
    return { error, success };
  },

  async UpdateWorkFlow(workflowId: string, updates: UpdateRequest) {
    const { error, success } = await apiClient.put(
      `/workflows/${workflowId}`,
      updates,
      {
        request: updateWorkflowRequestSchema,
      }
    );
    return { error, success };
  },

  async DeleteWorkFlow(workflowId: string) {
    const { error, success } = await apiClient.delete(
      `/workflows/${workflowId}`
    );
    return { error, success };
  },
};
