import { useRef, useState, useCallback } from 'react';

/**
 * useTTIMeasure 훅
 * TTI(Time to Interactive)를 측정하기 위한 커스텀 훅입니다.
 * - start(): 측정을 시작하고 시작 시점을 기록합니다.
 * - stop(): 측정을 종료하고, 측정된 TTI(ms)를 계산하여 상태에 저장합니다.
 * - tti: 측정된 TTI 값을 보관하며, 측정 전에는 null입니다.
 */
export function useTTIMeasure() {
  // 시작 시각을 저장하는 ref (null이면 측정 대기 상태)
  const startTS = useRef<number | null>(null);
  // 측정된 TTI 값을 저장하는 상태
  const [tti, setTTI] = useState<number | null>(null);

  /**
   * start: TTI 측정을 시작합니다.
   * @param nativeTimestamp - (옵션) 네이티브 이벤트 타임스탬프
   *                          주어지지 않으면 performance.now() 사용
   */
  const start = useCallback((nativeTimestamp?: number) => {
    // 측정 시작 시점 기록
    startTS.current = nativeTimestamp ?? performance.now();
    setTTI(null);
  }, []);

  /**
   * stop: TTI 측정을 종료합니다.
   * 성능 API로 측정된 종료 시점에서 시작 시점을 빼서 TTI 계산
   */
  const stop = useCallback(() => {
    // startTS.current가 유효한 숫자인지 확인
    if (typeof startTS.current === 'number') {
      // 측정 종료 시점
      const end = performance.now();
      // TTI 계산: 종료 시점 - 시작 시점
      const delta = end - startTS.current;
      if (Number.isFinite(delta)) {
        setTTI(delta);
      } else {
        console.warn('[useTTIMeasure] Invalid TTI calculation:', delta);
      }
      startTS.current = null;
    } else {
      console.warn('[useTTIMeasure] stop() called before start()');
    }
  }, []);

  // 측정 결과와 제어 함수 반환
  return { tti, start, stop };
}
