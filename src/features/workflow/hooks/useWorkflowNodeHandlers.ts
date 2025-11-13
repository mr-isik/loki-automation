/**
 * Custom hook for workflow nodes management
 * Following Single Responsibility Principle
 */

import {
  useCreateWorkflowNode,
  useDeleteWorkflowNode,
} from "@/features/node/hooks/useQueries";
import { NodeTemplateResponse } from "@/features/node/validation";
import { NodeChange, Node as ReactFlowNode } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  calculateCenterPosition,
  createNodeDataFromTemplate,
  createOptimisticNode,
  generateTempNodeId,
  updateNodeWithRealId,
} from "../utils/nodeHelpers";

interface UseWorkflowNodesParams {
  workflowId: string;
  screenToFlowPosition: (pos: { x: number; y: number }) => {
    x: number;
    y: number;
  };
  setLocalNodes: React.Dispatch<React.SetStateAction<ReactFlowNode[]>>;
  applyNodeChanges: (
    changes: NodeChange[],
    nodes: ReactFlowNode[]
  ) => ReactFlowNode[];
  pendingNodeUpdates: React.MutableRefObject<
    Map<string, { position_x: number; position_y: number }>
  >;
  triggerAutoSave: () => void;
}

export const useWorkflowNodeHandlers = ({
  workflowId,
  screenToFlowPosition,
  setLocalNodes,
  applyNodeChanges,
  pendingNodeUpdates,
  triggerAutoSave,
}: UseWorkflowNodesParams) => {
  const { mutateAsync: createNodeAsync } = useCreateWorkflowNode();
  const { mutate: deleteNode } = useDeleteWorkflowNode();

  /**
   * Handle node changes (position, deletion)
   */
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Apply changes to local state immediately for smooth UX
      setLocalNodes((nds) => applyNodeChanges(changes, nds));

      changes.forEach((change) => {
        if (change.type === "position" && change.position && !change.dragging) {
          // Add to pending updates (will be saved via auto-save)
          pendingNodeUpdates.current.set(change.id, {
            position_x: change.position.x,
            position_y: change.position.y,
          });
          triggerAutoSave();
        } else if (change.type === "remove") {
          // Delete node immediately
          deleteNode({
            nodeId: change.id,
            workflowId,
          });
        }
      });
    },
    [
      deleteNode,
      workflowId,
      triggerAutoSave,
      setLocalNodes,
      applyNodeChanges,
      pendingNodeUpdates,
    ]
  );

  /**
   * Handle template selection and create new node with optimistic updates
   */
  const handleTemplateSelect = useCallback(
    async (template: NodeTemplateResponse) => {
      const position = calculateCenterPosition(screenToFlowPosition);
      const tempId = generateTempNodeId();
      const nodeData = createNodeDataFromTemplate(template);

      // Add node to local state immediately (optimistic update)
      const optimisticNode = createOptimisticNode(
        tempId,
        template,
        position,
        nodeData,
        workflowId
      );

      setLocalNodes((nodes) => [...nodes, optimisticNode]);

      // Create node in API
      try {
        const response = await createNodeAsync({
          workflow_id: workflowId,
          template_id: template.id,
          position_x: position.x,
          position_y: position.y,
          data: nodeData,
        });

        // Replace temp node with real node from API
        setLocalNodes((nodes) =>
          nodes.map((node) =>
            updateNodeWithRealId(node, tempId, (response as any).id)
          )
        );

        toast.success(`Added ${template.name} node`);
      } catch (error: any) {
        // Remove optimistic node on error
        setLocalNodes((nodes) => nodes.filter((node) => node.id !== tempId));
        toast.error(error.message || "Failed to add node");
      }
    },
    [createNodeAsync, workflowId, screenToFlowPosition, setLocalNodes]
  );

  return {
    handleNodesChange,
    handleTemplateSelect,
  };
};
