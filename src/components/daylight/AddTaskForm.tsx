'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {LoaderCircle, Plus} from 'lucide-react';

interface AddTaskFormProps {
  onAddTask: (description: string, duration?: number) => Promise<void>;
  isLoading: boolean;
}

export function AddTaskForm({onAddTask, isLoading}: AddTaskFormProps) {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      const durationNum = duration ? parseInt(duration, 10) : undefined;
      onAddTask(description.trim(), durationNum);
      setDescription('');
      setDuration('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start">
       <div className="flex-grow space-y-2">
        <Input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g., Design the new homepage"
            disabled={isLoading}
            aria-label="New task description"
            className="w-full"
        />
         <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Time in minutes (optional)"
            disabled={isLoading}
            aria-label="Task duration in minutes"
            className="w-full"
        />
       </div>
      <Button type="submit" disabled={isLoading} size="icon" aria-label="Add task" className="h-10 w-10 mt-[21px] -translate-y-1/2">
        {isLoading ? <LoaderCircle className="animate-spin" /> : <Plus />}
      </Button>
    </form>
  );
}
