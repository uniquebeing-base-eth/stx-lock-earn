
import { useState, useEffect } from 'react';
import { getTimeRemaining } from '@/lib/locks';


interface CountdownTimerProps {
  deadline: Date;
  compact?: boolean;
}

const CountdownTimer = ({ deadline, compact = false }: CountdownTimerProps) => {
  const [time, setTime] = useState(getTimeRemaining(deadline));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (time.expired) {
    return (
      <span className="text-destructive font-mono font-bold text-sm animate-pulse">
        EXPIRED
      </span>
    );
  }

  const isUrgent = time.days === 0 && time.hours < 6;

  const pad = (n: number) => String(n).padStart(2, '0');

  if (compact) {
    return (
      <span className={`font-mono text-sm font-semibold ${isUrgent ? 'text-destructive' : 'text-foreground'}`}>
        {time.days > 0 && `${time.days}d `}{pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
      </span>
    );
  }

  return (
    <div className={`flex gap-2 ${isUrgent ? 'glow-danger' : ''} rounded-lg`}>
      {[
        { val: time.days, label: 'DAYS' },
        { val: time.hours, label: 'HRS' },
        { val: time.minutes, label: 'MIN' },
        { val: time.seconds, label: 'SEC' },
      ].map(({ val, label }) => (
        <div
          key={label}
          className={`flex flex-col items-center px-3 py-2 rounded-lg bg-secondary/50 border ${
            isUrgent ? 'border-destructive/30' : 'border-border'
          }`}
        >
          <span className={`font-mono text-lg font-bold ${isUrgent ? 'text-destructive' : 'text-foreground'}`}>
            {pad(val)}
          </span>
          <span className="text-[10px] text-muted-foreground tracking-wider">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
