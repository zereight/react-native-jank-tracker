import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import { JankContext } from './JankContext';
export function isJank(delta) {
    return delta > 16;
}
const JankTrackerProvider = ({ children }) => {
    const [lastJank, setLastJank] = useState(null);
    const lastTs = useRef(Date.now());
    useEffect(() => {
        let rafId;
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
    return (_jsx(JankContext.Provider, { value: { lastJank, setLastJank }, children: children }));
};
export default JankTrackerProvider;
