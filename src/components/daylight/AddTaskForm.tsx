'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {LoaderCircle, Plus} from 'lucide-react';

interface AddTaskFormProps {
  onAddTask: (description: string) => Promise<void>;
  isLoading: boolean;
}

export function AddTaskForm({onAddTask, isLoading}: AddTaskFormProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onAddTask(description.trim());
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="e.g., Design the new homepage"
        disabled={isLoading}
        aria-label="New task description"
      />
      <Button type="submit" disabled={isLoading} size="icon" aria-label="Add task">
        {isLoading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <Plus />
        )}
      </Button>
    </form>
  );
}
