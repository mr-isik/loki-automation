import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Workflow,
  canPublishWorkflow,
  canRunWorkflow,
} from "@/types/workflow.types";
import { Play, Settings, Upload } from "lucide-react";
import * as React from "react";

/**
 * HeaderActions Props
 * Following Interface Segregation Principle - only necessary callbacks
 */
interface HeaderActionsProps {
  workflow: Workflow;
  onRun: () => void;
  onPublish: () => void;
  onSettings: () => void;
  isRunning?: boolean;
  isPublishing?: boolean;
  className?: string;
}

/**
 * HeaderActions Component
 * Single Responsibility: Render action buttons for workflow operations
 * Dependency Inversion: Depends on workflow interface, not concrete implementation
 */
export const HeaderActions: React.FC<HeaderActionsProps> = ({
  workflow,
  onRun,
  onPublish,
  onSettings,
  isRunning = false,
  isPublishing = false,
  className,
}) => {
  const canRun = canRunWorkflow(workflow);
  const canPublish = canPublishWorkflow(workflow);

  return (
    <div className={className}>
      <TooltipProvider>
        <div className="flex items-center gap-2">
          {/* Run Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onRun}
                disabled={!canRun || isRunning}
                variant="default"
                size="sm"
              >
                {isRunning ? (
                  <>
                    <Spinner />
                    Running
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {!canRun ? "Workflow is already running" : "Run the workflow"}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Publish Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onPublish}
                disabled={!canPublish || isPublishing}
                variant="secondary"
                size="sm"
              >
                {isPublishing ? (
                  <>
                    <Spinner />
                    Publishing
                  </>
                ) : (
                  <>
                    <Upload />
                    Publish
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {!canPublish
                  ? "Workflow must be in draft or paused state"
                  : "Publish the workflow"}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Settings Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onSettings} variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Workflow settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

HeaderActions.displayName = "HeaderActions";
