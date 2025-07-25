'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import {cn} from '@/lib/utils';

const TaskProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorColor?: string;
  }
>(({className, value, indicatorColor, ...props}, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 transition-all duration-500"
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
        backgroundColor: indicatorColor || 'hsl(var(--primary))',
      }}
    />
  </ProgressPrimitive.Root>
));
TaskProgressBar.displayName = 'TaskProgressBar';

export {TaskProgressBar};
