import * as React from 'react';
import { JankContext, JankEvent } from './JankContext';

export function isJank(delta: number): boolean {
  return delta > 16;
}

const JankTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastJank, setLastJank] = React.useState<JankEvent | null>(null);
  const lastTs = React.useRef<number>(Date.now());

  React.useEffect(() => {
    let rafId: number;
    const tick = () => {
      const now = Date.now();
      const delta = now - lastTs.current;
      if (isJank(delta)) {
        setLastJank({ timestamp: now, delta });
      }
      lastTs.current = now;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <JankContext.Provider value={{ lastJank, setLastJank }}>{children}</JankContext.Provider>;
};

export default JankTrackerProvider;
