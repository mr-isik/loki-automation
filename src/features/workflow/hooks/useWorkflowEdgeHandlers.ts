/**
 * Custom hook for workflow edges management
 * Following Single Responsibility Principle
 */

import { reactFlowConnectionToApiEdge } from "@/features/node/adapters";
import {
  useCreateWorkflowEdge,
  useDeleteWorkflowEdge,
} from "@/features/node/hooks/useQueries";
import { Connection, EdgeChange, Edge as ReactFlowEdge } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";
import { apiEdgeToReactFlowEdge, edgeExists } from "../utils/edgeHelpers";

interface UseWorkflowEdgesParams {
  workflowId: string;
  setLocalEdges: React.Dispatch<React.SetStateAction<ReactFlowEdge[]>>;
  applyEdgeChanges: (
    changes: EdgeChange[],
    edges: ReactFlowEdge[]
  ) => ReactFlowEdge[];
}

export const useWorkflowEdgeHandlers = ({
  workflowId,
  setLocalEdges,
  applyEdgeChanges,
}: UseWorkflowEdgesParams) => {
  const { mutate: createEdge } = useCreateWorkflowEdge();
  const { mutate: deleteEdge } = useDeleteWorkflowEdge();

  /**
   * Handle edge changes (deletion)
   */
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      // Apply changes to local state immediately
      setLocalEdges((eds) => applyEdgeChanges(changes, eds));

      changes.forEach((change) => {
        if (change.type === "remove") {
          deleteEdge({
            edgeId: change.id,
            workflowId,
          });
        }
      });
    },
    [deleteEdge, workflowId, setLocalEdges, applyEdgeChanges]
  );

  /**
   * Handle new connection with duplicate prevention
   * Backend now returns the created edge, so no need for optimistic updates
   */
  const handleConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target || !params.workflowId) return;

      setLocalEdges((edges) => {
        if (edgeExists(edges, params.source!, params.target!)) {
          toast.error("Connection already exists between these nodes");
        }
        return edges;
      });

      // Check again after state update
      let shouldCreate = true;
      setLocalEdges((edges) => {
        if (edgeExists(edges, params.source!, params.target!)) {
          shouldCreate = false;
        }
        return edges;
      });

      if (!shouldCreate) return;

      const edgeData = reactFlowConnectionToApiEdge(params);
      createEdge(
        {
          payload: {
            ...edgeData,
            workflow_id: workflowId,
          },
        },
        {
          onSuccess: (response: any) => {
            const newEdge = apiEdgeToReactFlowEdge(response);
            setLocalEdges((edges) => [...edges, newEdge]);
            toast.success("Connection created");
          },
          onError: (error) => {
            toast.error(error.message || "Failed to create connection");
          },
        }
      );
    },
    [createEdge, workflowId, setLocalEdges]
  );

  return {
    handleEdgesChange,
    handleConnect,
  };
};
