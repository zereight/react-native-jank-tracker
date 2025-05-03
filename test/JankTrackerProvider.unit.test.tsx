import React from 'react';
import { render, act } from '@testing-library/react-native';
import JankTrackerProvider from '../src/JankTrackerProvider';
import { JankContext } from '../src/JankContext';

jest.useFakeTimers();

describe('JankTrackerProvider (unit)', () => {
  beforeAll(() => {
    global.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0) as unknown as number;
    global.cancelAnimationFrame = (id: number) => clearTimeout(id);
  });
  afterAll(() => {
    // @ts-ignore
    delete global.requestAnimationFrame;
    // @ts-ignore
    delete global.cancelAnimationFrame;
  });

  it('16ms 초과 프레임 드롭 발생 시 lastJank가 갱신된다', async () => {
    let contextValue: any = null;
    const TestComponent = () => {
      const ctx = React.useContext(JankContext);
      contextValue = ctx;
      return null;
    };
    render(
      <JankTrackerProvider>
        <TestComponent />
      </JankTrackerProvider>
    );
    await act(async () => {
      jest.advanceTimersByTime(20);
      await Promise.resolve(); // flush microtasks
    });
    expect(contextValue.lastJank).not.toBeNull();
    expect(contextValue.lastJank.delta).toBeGreaterThan(16);
  });
}); 