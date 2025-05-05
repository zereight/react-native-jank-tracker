import { useRef, useState, useCallback } from 'react';
import { InteractionManager } from 'react-native';

/**
 * useTTIMeasure Hook
 * A custom hook for measuring TTI (Time to Interactive).
 * By default, it uses an advanced measurement approach with InteractionManager.
 *
 * @param options - Measurement options
 * @param options.useInteractionManager - Whether to use InteractionManager (default: true)
 * @returns Measurement functions and values
 */
export function useTTIMeasure(options = { useInteractionManager: true }) {
  // Start timestamp ref (null means waiting for measurement)
  const startTS = useRef<number | null>(null);
  // TTI value state
  const [tti, setTTI] = useState<number | null>(null);
  // Measurement in progress state
  const [measuring, setMeasuring] = useState(false);
  // Cancel handler storage
  const cancelRef = useRef<(() => void) | null>(null);

  /**
   * start: Begins TTI measurement.
   * @param nativeTimestamp - (optional) Native event timestamp
   *                          Uses performance.now() if not provided
   */
  const start = useCallback((nativeTimestamp?: number) => {
    // Cancel existing measurement
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
    }

    // Record measurement start time
    startTS.current = nativeTimestamp ?? performance.now();
    setMeasuring(true);
    setTTI(null);
  }, []);

  /**
   * stop: Ends TTI measurement.
   * Calculates TTI by subtracting start time from end time measured with performance API
   */
  const stop = useCallback(() => {
    // Validate that startTS.current is a valid number
    if (typeof startTS.current === 'number') {
      // Measurement end time
      const end = performance.now();
      // Calculate TTI: end time - start time
      const delta = end - startTS.current;
      if (Number.isFinite(delta)) {
        setTTI(delta);
      } else {
        console.warn('[useTTIMeasure] Invalid TTI calculation:', delta);
      }
      startTS.current = null;
      setMeasuring(false);

      // Reset cancel handler
      cancelRef.current = null;
    } else {
      console.warn('[useTTIMeasure] stop() called before start()');
    }
  }, []);

  /**
   * measure: Executes a task and measures TTI.
   * Uses InteractionManager by default.
   *
   * @param task - Task function to measure
   * @returns Cancel function
   */
  const measure = useCallback(
    (task: () => void) => {
      start();

      try {
        // Execute task
        task();

        if (options.useInteractionManager) {
          // End measurement using InteractionManager
          const handle = InteractionManager.runAfterInteractions(() => {
            stop();
          });

          // Set up cancel handler
          cancelRef.current = () => {
            if (handle && handle.cancel) {
              handle.cancel();
            }
            setMeasuring(false);
          };

          return cancelRef.current;
        } else {
          // End measurement immediately (basic approach)
          stop();
          return () => {};
        }
      } catch (error) {
        console.error('[useTTIMeasure] Error during measurement:', error);
        stop();
        return () => {};
      }
    },
    [start, stop, options.useInteractionManager],
  );

  /**
   * Cancellation function
   */
  const cancel = useCallback(() => {
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
    }
    setMeasuring(false);
    setTTI(null);
    startTS.current = null;
  }, []);

  // Return measurement results and control functions
  return {
    tti,
    measuring,
    start,
    stop,
    measure,
    cancel,
  };
}
