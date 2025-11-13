import z from "zod";

export const createWorkflowNodeRequestSchema = z.object({
  position_x: z.number().min(0),
  position_y: z.number().min(0),
  template_id: z.uuid(),
  workflow_id: z.uuid(),
  data: z.record(z.any(), z.any()),
});

export const updateWorkflowNodeRequestSchema = z.object({
  position_x: z.number().min(0).optional(),
  position_y: z.number().min(0).optional(),
  data: z.record(z.any(), z.any()).optional(),
});

export const workflowNodeResponseSchema = z.object({
  id: z.uuid(),
  position_x: z.number().min(0),
  position_y: z.number().min(0),
  template_id: z.uuid(),
  workflow_id: z.uuid(),
  data: z.record(z.any(), z.any()),
});

export const workflowNodesResponseSchema = z.object({
  count: z.number().min(0),
  nodes: z.array(workflowNodeResponseSchema),
});

export const nodeTemplateResponseSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  type_key: z.string().min(1),
});

export const nodeTemplatesResponseSchema = z.object({
  count: z.number().min(0),
  templates: z.array(nodeTemplateResponseSchema),
});

export type CreateWorkflowNodeRequest = z.infer<
  typeof createWorkflowNodeRequestSchema
>;
export type UpdateWorkflowNodeRequest = z.infer<
  typeof updateWorkflowNodeRequestSchema
>;
export type WorkflowNodeResponse = z.infer<typeof workflowNodeResponseSchema>;
export type NodeTemplateResponse = z.infer<typeof nodeTemplateResponseSchema>;

/* Edges */
export const createWorkflowEdgeRequestSchema = z.object({
  workflow_id: z.uuid(),
  source_handle: z.string(),
  source_node_id: z.uuid(),
  target_handle: z.string(),
  target_node_id: z.uuid(),
});

export const updateWorkflowEdgeRequestSchema = z.object({
  source_handle: z.string().optional(),
  source_node_id: z.uuid().optional(),
  target_handle: z.string().optional(),
  target_node_id: z.uuid().optional(),
});

export const workflowEdgeResponseSchema = z.object({
  id: z.uuid(),
  source_handle: z.string(),
  source_node_id: z.uuid(),
  target_handle: z.string(),
  target_node_id: z.uuid(),
  workflow_id: z.uuid(),
});

export const workflowEdgesResponseSchema = z.object({
  count: z.number().min(0),
  edges: z.array(workflowEdgeResponseSchema),
});

export type CreateWorkflowEdgeRequest = z.infer<
  typeof createWorkflowEdgeRequestSchema
>;
export type UpdateWorkflowEdgeRequest = z.infer<
  typeof updateWorkflowEdgeRequestSchema
>;
