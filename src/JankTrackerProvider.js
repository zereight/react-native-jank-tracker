import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import { JankContext } from './JankContext';
const JankTrackerProvider = ({ children }) => {
    const [lastJank, setLastJank] = useState(null);
    const lastTs = useRef(Date.now());
    useEffect(() => {
        let rafId;
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
    return (_jsx(JankContext.Provider, { value: { lastJank, setLastJank }, children: children }));
};
export default JankTrackerProvider;
