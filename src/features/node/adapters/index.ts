/**
 * Adapters for converting between API and ReactFlow formats
 * Following Adapter Pattern - Converts between incompatible interfaces
 * Following Single Responsibility Principle
 */

import { AutomationNode, NodeType } from "@/types/node.types";
import { Edge, Node } from "@xyflow/react";
import { WorkflowNodeResponse } from "../validation";

export const apiNodeToReactFlowNode = (apiNode: WorkflowNodeResponse): Node => {
  const automationNode: AutomationNode = {
    id: apiNode.id,
    name: apiNode.data.label || apiNode.data.name || "Untitled Node",
    type: (apiNode.data.type as NodeType) || NodeType.API_CALL,
    description: apiNode.data.description || "",
    icon: apiNode.data.icon || "zap",
    category: apiNode.data.category || "General",
    ...apiNode.data,
  } as AutomationNode;

  return {
    id: apiNode.id,
    type: "customNode",
    position: {
      x: apiNode.position_x,
      y: apiNode.position_y,
    },
    data: {
      node: automationNode,
      templateId: apiNode.template_id,
      workflowId: apiNode.workflow_id,
    },
  };
};

export const reactFlowNodeToApiNode = (node: Node, workflowId: string) => {
  return {
    position_x: node.position.x,
    position_y: node.position.y,
    workflow_id: workflowId,
    template_id: node.data?.templateId || "",
    data: node.data || {},
  };
};

export const apiEdgeToReactFlowEdge = (apiEdge: {
  id: string;
  source_node_id: string;
  target_node_id: string;
  source_handle: string;
  target_handle: string;
  workflow_id: string;
}): Edge => {
  return {
    id: apiEdge.id,
    source: apiEdge.source_node_id,
    target: apiEdge.target_node_id,
    // Don't specify handle if it's "default" - let ReactFlow handle it
    sourceHandle: undefined,
    targetHandle: undefined,
    animated: true,
  };
};

export const reactFlowConnectionToApiEdge = (params: {
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}) => {
  return {
    source_node_id: params.source,
    target_node_id: params.target,
    source_handle: params.sourceHandle || "default",
    target_handle: params.targetHandle || "default",
  };
};
