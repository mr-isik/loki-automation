/**
 * WorkflowEditor Component
 * Refactored following SOLID Principles
 * - Single Responsibility: Focuses only on rendering and orchestrating
 * - Open/Closed: Easy to extend with new features via hooks
 * - Dependency Inversion: Depends on abstractions (hooks, utils)
 */

"use client";

import { Button } from "@/components/ui/button";
import {
  apiEdgeToReactFlowEdge,
  apiNodeToReactFlowNode,
} from "@/features/node/adapters";
import CustomNode from "@/features/node/components/Node";
import { NodeTemplateSheet } from "@/features/node/components/NodeTemplateSheet";
import {
  useUpdateWorkflowNode,
  useWorkflowEdges,
  useWorkflowNodes,
} from "@/features/node/hooks/useQueries";
import { useAutoSave } from "@/features/workflow/hooks/useAutoSave";
import { useWorkflowEdgeHandlers } from "@/features/workflow/hooks/useWorkflowEdgeHandlers";
import { useWorkflowNodeHandlers } from "@/features/workflow/hooks/useWorkflowNodeHandlers";
import {
  executeBatchSave,
  processInitialEdges,
} from "@/features/workflow/utils/workflowHelpers";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  Edge as ReactFlowEdge,
  Node as ReactFlowNode,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface WorkflowEditorProps {
  workflowId: string;
  onSaveStateChange?: (isSaving: boolean, hasUnsavedChanges: boolean) => void;
}

/**
 * WorkflowEditor - Clean, SOLID-compliant workflow canvas
 */
const WorkflowEditor = ({
  workflowId,
  onSaveStateChange,
}: WorkflowEditorProps) => {
  // UI State
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
  const { screenToFlowPosition } = useReactFlow();

  // Local state for optimistic updates
  const [localNodes, setLocalNodes] = useState<ReactFlowNode[]>([]);
  const [localEdges, setLocalEdges] = useState<ReactFlowEdge[]>([]);

  // Track pending changes for batch update
  const pendingNodeUpdates = useRef<
    Map<string, { position_x: number; position_y: number }>
  >(new Map());

  // Data fetching
  const { data: apiNodes, isLoading: nodesLoading } =
    useWorkflowNodes(workflowId);
  const { data: apiEdges, isLoading: edgesLoading } =
    useWorkflowEdges(workflowId);

  // Mutations
  const { mutateAsync: updateNodeAsync } = useUpdateWorkflowNode();

  // Node types configuration
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  // Initialize and validate data from API
  const initialNodes = useMemo(() => {
    if (!apiNodes) return [];
    return apiNodes.map(apiNodeToReactFlowNode);
  }, [apiNodes]);

  const initialEdges = useMemo(() => {
    if (!apiEdges) return [];
    return processInitialEdges(apiEdges.map(apiEdgeToReactFlowEdge));
  }, [apiEdges]);

  // Sync initial data to local state
  useEffect(() => {
    setLocalNodes(initialNodes);
  }, [initialNodes]);

  useEffect(() => {
    setLocalEdges(initialEdges);
  }, [initialEdges]);

  // Batch save function
  const performBatchSave = useCallback(async () => {
    await executeBatchSave(
      pendingNodeUpdates.current,
      async (nodeId, position) => {
        return updateNodeAsync({
          nodeId,
          payload: position,
          workflowId,
        });
      }
    );
  }, [updateNodeAsync, workflowId]);

  // Auto-save hook
  const { triggerAutoSave, saveNow, hasUnsavedChanges, isSaving } = useAutoSave(
    {
      onSave: performBatchSave,
      delay: 2000,
      enabled: true,
    }
  );

  // Notify parent about save state changes
  useEffect(() => {
    onSaveStateChange?.(isSaving, hasUnsavedChanges);
  }, [isSaving, hasUnsavedChanges, onSaveStateChange]);

  // Expose saveNow to parent (for manual save button)
  useEffect(() => {
    (window as any).__workflowEditorSave = saveNow;
    return () => {
      delete (window as any).__workflowEditorSave;
    };
  }, [saveNow]);

  const { handleNodesChange, handleTemplateSelect } = useWorkflowNodeHandlers({
    workflowId,
    screenToFlowPosition,
    setLocalNodes,
    applyNodeChanges,
    pendingNodeUpdates,
    triggerAutoSave,
  });

  const { handleEdgesChange, handleConnect } = useWorkflowEdgeHandlers({
    workflowId,
    setLocalEdges,
    applyEdgeChanges,
  });

  // Loading state
  if (nodesLoading || edgesLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading workflow...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        fitView
        edgesFocusable
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: "hsl(var(--primary))" },
        }}
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background gap={30} size={2} />
      </ReactFlow>

      {/* Add Node Button */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          size="lg"
          onClick={() => setIsTemplateSheetOpen(true)}
          className="shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Node
        </Button>
      </div>

      {/* Empty State */}
      {localNodes.length === 0 && !nodesLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium">Your workflow is empty</p>
              <p className="text-sm">
                Click &quot;Add Node&quot; to get started
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Node Template Sheet */}
      <NodeTemplateSheet
        open={isTemplateSheetOpen}
        onOpenChange={setIsTemplateSheetOpen}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  );
};

export default WorkflowEditor;
