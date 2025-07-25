'use client';

import {useMemo} from 'react';
import type {Task} from '@/lib/types';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {TaskProgressBar} from './TaskProgressBar';

interface ProgressSectionProps {
  tasks: Task[];
}

function formatDuration(minutes: number) {
  if (minutes <= 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (mins > 0) result += `${mins}m`;
  return result.trim() || '0m';
}

export function ProgressSection({tasks}: ProgressSectionProps) {
  const {
    totalDuration,
    completedDuration,
    progress,
    timeLeft,
    progressColor,
  } = useMemo(() => {
    const total = tasks.reduce((sum, task) => sum + task.duration, 0);
    const completed = tasks
      .filter(t => t.completed)
      .reduce((sum, task) => sum + task.duration, 0);
    const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
    const remaining = total - completed;

    // Transition from red (hue 0) to green (hue 120)
    const hue = Math.min(progressPercentage * 1.2, 120);
    const color = `hsl(${hue}, 70%, 50%)`;

    return {
      totalDuration: total,
      completedDuration: completed,
      progress: progressPercentage,
      timeLeft: remaining,
      progressColor: color,
    };
  }, [tasks]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Daily Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TaskProgressBar value={progress} indicatorColor={progressColor} />
          <div className="flex justify-between font-medium text-muted-foreground">
            <span>{formatDuration(completedDuration)} done</span>
            <span className="text-primary font-semibold">
              {formatDuration(timeLeft)} left
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
