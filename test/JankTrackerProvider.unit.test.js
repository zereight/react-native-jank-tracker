import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { render, act } from '@testing-library/react-native';
import JankTrackerProvider from '../src/JankTrackerProvider';
import { JankContext } from '../src/JankContext';
jest.useFakeTimers();
describe('JankTrackerProvider (unit)', () => {
    beforeAll(() => {
        global.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
        global.cancelAnimationFrame = (id) => clearTimeout(id);
    });
    afterAll(() => {
        // @ts-ignore
        delete global.requestAnimationFrame;
        // @ts-ignore
        delete global.cancelAnimationFrame;
    });
    it('16ms 초과 프레임 드롭 발생 시 lastJank가 갱신된다', async () => {
        let contextValue = null;
        const TestComponent = () => {
            const ctx = React.useContext(JankContext);
            contextValue = ctx;
            return null;
        };
        render(_jsx(JankTrackerProvider, { children: _jsx(TestComponent, {}) }));
        await act(async () => {
            jest.advanceTimersByTime(20);
            await Promise.resolve(); // flush microtasks
        });
        expect(contextValue.lastJank).not.toBeNull();
        expect(contextValue.lastJank.delta).toBeGreaterThan(16);
    });
});
