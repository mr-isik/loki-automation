"use client";

import { AutomationNode, NodeType } from "@/types/node.types";
import { Handle, Position } from "@xyflow/react";
import { Globe, LucideIcon, MessageSquare, Terminal, Zap } from "lucide-react";
import { memo } from "react";

interface CustomNodeProps {
  data: {
    node: AutomationNode;
    selected?: boolean;
  };
  selected?: boolean;
}

const getNodeIcon = (type: NodeType): LucideIcon => {
  switch (type) {
    case NodeType.API_CALL:
      return Globe;
    case NodeType.SHELL_COMMAND:
      return Terminal;
    case NodeType.DISCORD_MESSAGE:
      return MessageSquare;
    default:
      return Zap;
  }
};

const getNodeColor = (type: NodeType) => {
  switch (type) {
    case NodeType.API_CALL:
      return {
        main: "#FF6D5A",
        border: "border-[#FF6D5A]",
        borderBottom: "border-b-[#E85B4A]",
        borderRight: "border-r-[#E85B4A]",
        icon: "text-white",
        iconBg: "bg-[#FF6D5A]",
      };
    case NodeType.SHELL_COMMAND:
      return {
        main: "#10B981",
        border: "border-[#10B981]",
        borderBottom: "border-b-[#059669]",
        borderRight: "border-r-[#059669]",
        icon: "text-white",
        iconBg: "bg-[#10B981]",
      };
    case NodeType.DISCORD_MESSAGE:
      return {
        main: "#8B5CF6",
        border: "border-[#8B5CF6]",
        borderBottom: "border-b-[#7C3AED]",
        borderRight: "border-r-[#7C3AED]",
        icon: "text-white",
        iconBg: "bg-[#8B5CF6]",
      };
    default:
      return {
        main: "#6B7280",
        border: "border-[#6B7280]",
        borderBottom: "border-b-[#4B5563]",
        borderRight: "border-r-[#4B5563]",
        icon: "text-white",
        iconBg: "bg-[#6B7280]",
      };
  }
};

const CustomNode = memo(({ data, selected }: CustomNodeProps) => {
  const { node } = data;
  const colors = getNodeColor(node.type);

  const renderIcon = () => {
    const Icon = getNodeIcon(node.type);
    return <Icon className={`w-4 h-4 ${colors.icon}`} />;
  };

  return (
    <div className="relative">
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2! h-2! bg-gray-400! border-0!"
      />

      {/* n8n Minimal Style Node */}
      <div
        className={`
          bg-white dark:bg-gray-900 w-16 h-16 flex items-center justify-center
          border-2
          border-b-4
          rounded-lg
          transition-all duration-200
          ${selected ? "ring-2 ring-offset-2 ring-primary" : ""}
        `}
      >
        {/* Header - Minimal */}
        <div className="px-3 py-2 flex items-center gap-2.5">
          {/* Icon Circle */}
          <div
            className={`w-7! h-7! rounded-full ${colors.iconBg} flex items-center justify-center shrink-0`}
          >
            {renderIcon()}
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2! h-2! bg-gray-400! border-0!"
      />

      {/* Node Content */}
      <div className="p-2 absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-max max-w-xs text-center">
        <h4 className="text-sm font-medium">{node.name}</h4>
        <p className="text-xs text-gray-500">{node.description}</p>
      </div>
    </div>
  );
});

CustomNode.displayName = "CustomNode";

export default CustomNode;
