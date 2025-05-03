import { isJank } from '../src/JankTrackerProvider';

describe('isJank', () => {
  it('16ms 이하일 때는 false를 반환한다', () => {
    expect(isJank(10)).toBe(false);
    expect(isJank(16)).toBe(false);
  });
  it('16ms 초과일 때는 true를 반환한다', () => {
    expect(isJank(16.1)).toBe(true);
    expect(isJank(30)).toBe(true);
    expect(isJank(100)).toBe(true);
  });
}); 