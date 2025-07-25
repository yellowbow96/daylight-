'use client';

import type {Task} from '@/lib/types';
import {TaskItem} from './TaskItem';
import {ScrollArea} from '../ui/scroll-area';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({tasks, onToggleTask, onDeleteTask}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
        <p>Your task list is empty.</p>
        <p>Add a task to start planning your day!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <ul className="space-y-3">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
          />
        ))}
      </ul>
    </ScrollArea>
  );
}
