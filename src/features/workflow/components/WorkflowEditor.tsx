"use client";

import { mockNodes } from "@/data/mockNodes";
import CustomNode from "@/features/node/components/Node";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  Node,
  NodeChange,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo, useState } from "react";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "customNode",
    position: { x: 250, y: 50 },
    data: { node: mockNodes[0] }, // API Call - Fetch User Data
  },
  {
    id: "2",
    type: "customNode",
    position: { x: 250, y: 250 },
    data: { node: mockNodes[6] }, // Shell Command - List Files
  },
  {
    id: "3",
    type: "customNode",
    position: { x: 600, y: 150 },
    data: { node: mockNodes[13] }, // Discord - Send Notification
  },
  {
    id: "4",
    type: "customNode",
    position: { x: 600, y: 350 },
    data: { node: mockNodes[1] }, // API Call - Create New User
  },
];

const initialEdges: Edge[] = [
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e2-4", source: "2", target: "4", animated: true },
];

const WorkflowEditor = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: "hsl(var(--primary))" },
        }}
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background gap={30} size={2} />
      </ReactFlow>
    </div>
  );
};

export default WorkflowEditor;
