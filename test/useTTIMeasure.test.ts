import { renderHook, act } from '@testing-library/react-hooks';
import { useTTIMeasure } from '../src/useTTIMeasure';

describe('useTTIMeasure', () => {
  it('start/stop 호출 시 TTI가 계산된다', () => {
    const { result } = renderHook(() => useTTIMeasure());
    act(() => {
      result.current.start(1000);
    });
    jest.spyOn(global.performance, 'now').mockReturnValue(1100);
    act(() => {
      result.current.stop();
    });
    expect(result.current.tti).toBeCloseTo(100);
  });
});
