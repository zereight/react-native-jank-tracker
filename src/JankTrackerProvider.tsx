import * as React from 'react';
import { JankContext, JankEvent, JankContextValue } from './JankContext';

const MAX_HISTORY = 60;

export function isJank(delta: number): boolean {
  return delta > 17;
}

const JankTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastJank, setLastJank] = React.useState<JankEvent | null>(null);
  const [deltaHistory, setDeltaHistory] = React.useState<number[]>([]);
  const lastTs = React.useRef<number>(Date.now());

  React.useEffect(() => {
    let rafId: number;
    const tick = () => {
      const now = Date.now();
      const delta = now - lastTs.current;

      setDeltaHistory(prevHistory => {
        const newHistory = [...prevHistory, delta];
        const slicedHistory = newHistory.slice(Math.max(newHistory.length - MAX_HISTORY, 0));

        return slicedHistory;
      });

      if (isJank(delta)) {
        setLastJank({ timestamp: now, delta });
      }
      lastTs.current = now;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  const contextValue: JankContextValue = React.useMemo(() => {
    return {
      lastJank,
      setLastJank,
      deltaHistory,
    };
  }, [lastJank, deltaHistory]);

  return <JankContext.Provider value={contextValue}>{children}</JankContext.Provider>;
};

export default JankTrackerProvider;
