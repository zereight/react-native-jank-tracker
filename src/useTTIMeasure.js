import { useRef, useState, useCallback } from 'react';
export function useTTIMeasure() {
    const startTS = useRef(null);
    const [tti, setTTI] = useState(null);
    const start = useCallback((nativeTimestamp) => {
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
