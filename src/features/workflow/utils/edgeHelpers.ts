/**
 * Edge Helper Functions
 * Following Single Responsibility Principle
 */

import { Edge as ReactFlowEdge } from "@xyflow/react";

/**
 * Convert API edge response to ReactFlow edge format
 */
export const apiEdgeToReactFlowEdge = (apiEdge: any): ReactFlowEdge => {
  return {
    id: apiEdge.id,
    source: apiEdge.source_node_id,
    target: apiEdge.target_node_id,
    animated: true,
  };
};

/**
 * Check if an edge already exists between two nodes
 */
export const edgeExists = (
  edges: ReactFlowEdge[],
  source: string,
  target: string
): boolean => {
  return edges.some((edge) => edge.source === source && edge.target === target);
};
