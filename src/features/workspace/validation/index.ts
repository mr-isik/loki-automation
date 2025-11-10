import z from "zod";

export const WorkspaceResponseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Workspace name is required"),
  created_at: z.string(),
});

export const WorkspacesResponseSchema = z.array(WorkspaceResponseSchema);

export type Workspace = z.infer<typeof WorkspaceResponseSchema>;

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .min(3, "Workspace name must be at least 3 characters")
    .max(50, "Workspace name must not exceed 50 characters"),
});

export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;
