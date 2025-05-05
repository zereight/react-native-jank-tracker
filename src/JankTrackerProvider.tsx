import * as React from 'react';
import { JankContext, JankEvent, JankContextValue } from './JankContext';

const MAX_HISTORY = 60;

export function isJank(delta: number): boolean {
  return delta > 17;
}

const JankTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('[JankTrackerProvider] Component function executed');

  const [lastJank, setLastJank] = React.useState<JankEvent | null>(null);
  const [deltaHistory, setDeltaHistory] = React.useState<number[]>([]);
  const lastTs = React.useRef<number>(Date.now());

  React.useEffect(() => {
    console.log('[JankTrackerProvider] useEffect triggered');
    let rafId: number;
    const tick = () => {
      const now = Date.now();
      const delta = now - lastTs.current;

      setDeltaHistory(prevHistory => {
        const newHistory = [...prevHistory, delta];
        const slicedHistory = newHistory.slice(Math.max(newHistory.length - MAX_HISTORY, 0));
        console.log(
          '[JankTrackerProvider] setDeltaHistory computed new length:',
          slicedHistory.length,
        );
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
      console.log('[JankTrackerProvider] useEffect cleanup');
      cancelAnimationFrame(rafId);
    };
  }, []);

  const contextValue: JankContextValue = React.useMemo(() => {
    console.log(
      '[JankTrackerProvider] useMemo creating value, deltaHistory length:',
      deltaHistory.length,
    );
    return {
      lastJank,
      setLastJank,
      deltaHistory,
    };
  }, [lastJank, deltaHistory]);

  console.log(
    '[JankTrackerProvider] Rendering, contextValue deltaHistory length:',
    contextValue.deltaHistory.length,
  );

  return <JankContext.Provider value={contextValue}>{children}</JankContext.Provider>;
};

export default JankTrackerProvider;
