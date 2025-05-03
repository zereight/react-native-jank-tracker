import React from 'react';
import { render, act } from '@testing-library/react-native';
import JankTrackerProvider from '../src/JankTrackerProvider';
import { JankContext } from '../src/JankContext';

jest.useFakeTimers();

describe('JankTrackerProvider', () => {
  it('16ms 초과 프레임 드롭 발생 시 lastJank가 갱신된다', () => {
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
    const now = Date.now();
    jest.spyOn(Date, 'now').mockImplementationOnce(() => now);
    act(() => {
      jest.advanceTimersByTime(20);
    });
    expect(contextValue.lastJank).not.toBeNull();
    expect(contextValue.lastJank.delta).toBeGreaterThan(16);
  });
});
