'use client';

import {useState, useEffect} from 'react';

export function Clock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on client
    setTime(new Date());

    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formattedTime = time
    ? time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : '--:-- --';

  return (
    <div className="text-2xl sm:text-3xl font-mono text-primary/80 bg-background/50 rounded-lg px-4 py-2 shadow-inner tabular-nums">
      {formattedTime}
    </div>
  );
}
