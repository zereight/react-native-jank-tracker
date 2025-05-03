import React, { useRef, useEffect, useState } from 'react';
import { JankContext, JankEvent } from './JankContext';

const JankTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastJank, setLastJank] = useState<JankEvent | null>(null);
  const lastTs = useRef<number>(Date.now());

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const now = Date.now();
      const delta = now - lastTs.current;
      if (delta > 16) {
        setLastJank({ timestamp: now, delta });
      }
      lastTs.current = now;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <JankContext.Provider value={{ lastJank, setLastJank }}>
      {children}
    </JankContext.Provider>
  );
};

export default JankTrackerProvider;
