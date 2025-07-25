'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function DayNightWidget() {
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const updateDayNight = () => {
      const hour = new Date().getHours();
      // Day is between 6 AM and 6 PM
      setIsDay(hour >= 6 && hour < 18);
    };

    updateDayNight();
    const timerId = setInterval(updateDayNight, 60000); // Update every minute

    return () => clearInterval(timerId);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/50 text-primary/80 shadow-inner">
            {isDay ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
            <span className="sr-only">{isDay ? 'Daytime' : 'Nighttime'}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isDay ? 'Daytime' : 'Nighttime'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
