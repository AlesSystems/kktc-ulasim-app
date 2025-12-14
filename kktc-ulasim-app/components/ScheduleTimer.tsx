'use client';

import { useEffect, useState } from 'react';

interface ScheduleTimerProps {
  time: string; // Format: 'HH:mm:ss' or 'HH:mm'
}

export default function ScheduleTimer({ time }: ScheduleTimerProps) {
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    
    const calculateMinutesLeft = () => {
      const now = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      
      const scheduleTime = new Date();
      scheduleTime.setHours(hours, minutes, 0, 0);
      
      const diffMs = scheduleTime.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      
      setMinutesLeft(diffMinutes);
    };

    calculateMinutesLeft();
    const interval = setInterval(calculateMinutesLeft, 60000); // Update every 60 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [time]);

  // Server render or initial client render: show static time
  if (!isMounted || minutesLeft === null) {
    return <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{time}</span>;
  }

  // 1. Past schedule (missed)
  if (minutesLeft < 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-zinc-400 dark:text-zinc-500 line-through">{time}</span>
        <span className="px-2 py-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-600 rounded-full">
          Kaçtı
        </span>
      </div>
    );
  }

  // 2. Very close (< 10 minutes)
  if (minutesLeft < 10) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-zinc-600 dark:text-zinc-300">{time}</span>
        <span className="px-3 py-1 text-sm font-bold text-white bg-red-500 rounded-full animate-pulse">
          {minutesLeft} dk kaldı
        </span>
      </div>
    );
  }

  // 3. Close (< 60 minutes)
  if (minutesLeft < 60) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-zinc-600 dark:text-zinc-300">{time}</span>
        <span className="px-3 py-1 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-green-500 rounded-full">
          {minutesLeft} dk kaldı
        </span>
      </div>
    );
  }

  // 4. Far (> 1 hour) - just show the time
  return <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{time}</span>;
}
