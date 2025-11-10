import z from "zod";

export const workflowResponseSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  status: z.string(),
  title: z.string().min(1, "Workflow title is required"),
  updated_at: z.string(),
  workspace_id: z.string(),
});

export const updateWorkflowRequestSchema = z.object({
  status: z.string().optional(),
  title: z.string().min(1, "Workflow title is required").optional(),
});

export const workflowsResponseSchema = z
  .array(workflowResponseSchema)
  .nullable();

export type UpdateRequest = z.infer<typeof updateWorkflowRequestSchema>;
