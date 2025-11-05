import * as React from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * WorkflowNameInput Props
 * Following Interface Segregation Principle
 */
interface WorkflowNameInputProps {
  initialName: string;
  onNameChange: (name: string) => void;
  className?: string;
}

/**
 * WorkflowNameInput Component
 * Single Responsibility: Handle editable workflow name
 * Supports inline editing with confirmation/cancellation
 */
export const WorkflowNameInput: React.FC<WorkflowNameInputProps> = ({
  initialName,
  onNameChange,
  className,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(initialName);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (name.trim() && name !== initialName) {
      onNameChange(name.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(initialName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-9 text-lg font-semibold"
          placeholder="Workflow Name"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          className="h-8 w-8 p-0"
          disabled={!name.trim()}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2 group', className)}>
      <h1 className="text-lg font-semibold truncate">{name}</h1>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Edit workflow name"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

WorkflowNameInput.displayName = 'WorkflowNameInput';
