/**
 * Node Helper Functions
 * Following Single Responsibility Principle
 */

import { NodeTemplateResponse } from "@/features/node/validation";
import { Node as ReactFlowNode } from "@xyflow/react";

/**
 * Generate unique temporary node ID
 */
export const generateTempNodeId = (): string => {
  return `temp-node-${Date.now()}-${Math.random()}`;
};

/**
 * Calculate center position of viewport
 */
export const calculateCenterPosition = (
  screenToFlowPosition: (pos: { x: number; y: number }) => {
    x: number;
    y: number;
  }
) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  return screenToFlowPosition({ x: centerX, y: centerY });
};

/**
 * Create node data from template
 */
export const createNodeDataFromTemplate = (
  template: NodeTemplateResponse
): Record<string, any> => {
  const baseData = {
    label: template.name,
    name: template.name,
    type: template.type_key,
    description: template.description,
    category: template.category,
    icon: "zap",
  };

  // Add type-specific default values
  const typeDefaults: Record<string, any> = {
    api_call: {
      method: "GET",
      endpoint: "",
    },
    shell_command: {
      command: "",
      shell: "bash",
    },
    discord_message: {
      webhookUrl: "",
      channelId: "",
    },
  };

  return {
    ...baseData,
    ...(typeDefaults[template.type_key] || {}),
  };
};

/**
 * Create optimistic node for immediate UI feedback
 */
export const createOptimisticNode = (
  tempId: string,
  template: NodeTemplateResponse,
  position: { x: number; y: number },
  nodeData: Record<string, any>,
  workflowId: string
): ReactFlowNode => {
  return {
    id: tempId,
    type: "customNode",
    position,
    data: {
      node: {
        id: tempId,
        ...nodeData,
      } as any,
      templateId: template.id,
      workflowId: workflowId,
    },
  };
};

/**
 * Update node with real ID from API response
 */
export const updateNodeWithRealId = (
  node: ReactFlowNode,
  tempId: string,
  realId: string
): ReactFlowNode => {
  if (node.id !== tempId) return node;

  return {
    ...node,
    id: realId,
    data: {
      ...node.data,
      node: {
        ...(node.data.node as any),
        id: realId,
      },
    },
  };
};
