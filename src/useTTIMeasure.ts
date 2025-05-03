import { useRef, useState, useCallback } from 'react';

export function useTTIMeasure() {
  const startTS = useRef<number | null>(null);
  const [tti, setTTI] = useState<number | null>(null);

  const start = useCallback((nativeTimestamp?: number) => {
    startTS.current = nativeTimestamp ?? performance.now();
    setTTI(null);
  }, []);

  const stop = useCallback(() => {
    if (startTS.current !== null) {
      const end = performance.now();
      setTTI(end - startTS.current);
      startTS.current = null;
    }
  }, []);

  return { tti, start, stop };
}
