'use client';

import {memo} from 'react';
import {Trash2} from 'lucide-react';
import {cn} from '@/lib/utils';
import type {Task} from '@/lib/types';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export const TaskItem = memo(({task, onToggle, onDelete}: TaskItemProps) => {
  return (
    <li
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
        task.completed
          ? 'bg-secondary/50'
          : 'bg-background hover:bg-secondary/30'
      )}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        aria-label={`Mark task as ${task.completed ? 'incomplete' : 'complete'}`}
      />
      <div className="flex-1">
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            'font-medium transition-all duration-300 cursor-pointer',
            task.completed ? 'line-through text-muted-foreground' : ''
          )}
        >
          {task.description}
        </label>
      </div>
      <div className="text-sm text-muted-foreground bg-secondary/80 px-2 py-1 rounded-md">
        {formatDuration(task.duration)}
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Task</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
});

TaskItem.displayName = 'TaskItem';
