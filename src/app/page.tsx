'use client';

import {useState, useEffect, useCallback} from 'react';
import {ListTodo, Moon, Save, Sun, Trash2} from 'lucide-react';

import type {Task} from '@/lib/types';
import {estimateTaskDuration} from '@/ai/flows/estimate-task-duration';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';

import {Clock} from '@/components/daylight/Clock';
import {AddTaskForm} from '@/components/daylight/AddTaskForm';
import {TaskList} from '@/components/daylight/TaskList';
import {ProgressSection} from '@/components/daylight/ProgressSection';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {MusicPlayer} from '@/components/daylight/MusicPlayer';
import {DayNightWidget} from '@/components/daylight/DayNightWidget';

const MAX_MINUTES_IN_DAY = 16 * 60; // 16 hours
const LOCAL_STORAGE_KEY_TASKS = 'daylight-tasks';
const LOCAL_STORAGE_KEY_THEME = 'daylight-theme';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [theme, setTheme] = useState('light');
  const {toast} = useToast();

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY_TASKS);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
      const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEY_THEME);
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    } catch (error) {
      console.error('Failed to load from local storage:', error);
      toast({
        title: 'Error',
        description: 'Could not load saved settings.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleAddTask = useCallback(
    async (taskDescription: string, duration?: number) => {
      if (!taskDescription.trim()) return;

      setIsAddingTask(true);
      try {
        let estimatedDurationMinutes = duration;
        if (typeof estimatedDurationMinutes !== 'number' || estimatedDurationMinutes <= 0) {
          const {estimatedDurationMinutes: aiDuration} =
            await estimateTaskDuration({
              taskDescription,
            });
            estimatedDurationMinutes = aiDuration;
        }

        const currentTotalDuration = tasks.reduce(
          (sum, task) => sum + task.duration,
          0
        );

        if (
          currentTotalDuration + estimatedDurationMinutes >
          MAX_MINUTES_IN_DAY
        ) {
          toast({
            title: 'Time limit exceeded!',
            description:
              "This task would push you over your 16-hour limit for the day. Consider shortening your day's plan.",
            variant: 'destructive',
          });
          return;
        }

        const newTask: Task = {
          id: crypto.randomUUID(),
          description: taskDescription,
          completed: false,
          duration: estimatedDurationMinutes,
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
      } catch (error) {
        console.error('Failed to estimate task duration:', error);
        toast({
          title: 'AI Error',
          description: 'Could not get a time estimate for the task.',
          variant: 'destructive',
        });
      } finally {
        setIsAddingTask(false);
      }
    },
    [tasks, toast]
  );

  const handleToggleTask = useCallback((taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? {...task, completed: !task.completed} : task
      )
    );
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  const handleSaveTasks = useCallback(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TASKS, JSON.stringify(tasks));
      toast({
        title: 'Tasks Saved',
        description: 'Your task list has been saved successfully.',
      });
    } catch (error) {
      console.error('Failed to save tasks to local storage:', error);
      toast({
        title: 'Error',
        description: 'Could not save your tasks.',
        variant: 'destructive',
      });
    }
  }, [tasks, toast]);

  const handleClearTasks = useCallback(() => {
    setTasks([]);
  }, []);

  return (
    <main className="container mx-auto min-h-screen p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <ListTodo className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary/90">
            Daylight
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <DayNightWidget />
          <Clock />
          <Button onClick={toggleTheme} variant="ghost" size="icon">
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      <ProgressSection tasks={tasks} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-1 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Plan Your Day</CardTitle>
            </CardHeader>
            <CardContent>
              <AddTaskForm onAddTask={handleAddTask} isLoading={isAddingTask} />
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  onClick={handleSaveTasks}
                  className="flex-grow sm:flex-grow-0"
                >
                  <Save />
                  Save List
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex-grow sm:flex-grow-0"
                    >
                      <Trash2 /> Clear All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all tasks from your current
                        list. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearTasks}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
          <MusicPlayer />
        </div>
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
