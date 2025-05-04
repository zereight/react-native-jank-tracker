import { useRef, useState, useCallback } from 'react';
import { InteractionManager } from 'react-native';

/**
 * useTTIMeasure 훅
 * TTI(Time to Interactive)를 측정하기 위한 커스텀 훅입니다.
 * 기본적으로 InteractionManager를 활용한 고급 측정 방식을 사용합니다.
 *
 * @param options - 측정 옵션
 * @param options.useInteractionManager - InteractionManager 사용 여부 (기본값: true)
 * @returns 측정 관련 함수와 측정값
 */
export function useTTIMeasure(options = { useInteractionManager: true }) {
  // 시작 시각을 저장하는 ref (null이면 측정 대기 상태)
  const startTS = useRef<number | null>(null);
  // 측정된 TTI 값을 저장하는 상태
  const [tti, setTTI] = useState<number | null>(null);
  // 측정 중 상태를 저장
  const [measuring, setMeasuring] = useState(false);
  // 취소 핸들러 저장
  const cancelRef = useRef<(() => void) | null>(null);

  /**
   * start: TTI 측정을 시작합니다.
   * @param nativeTimestamp - (옵션) 네이티브 이벤트 타임스탬프
   *                          주어지지 않으면 performance.now() 사용
   */
  const start = useCallback((nativeTimestamp?: number) => {
    // 기존 측정 취소
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
    }

    // 측정 시작 시점 기록
    startTS.current = nativeTimestamp ?? performance.now();
    setMeasuring(true);
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
      setMeasuring(false);

      // 취소 핸들러 초기화
      cancelRef.current = null;
    } else {
      console.warn('[useTTIMeasure] stop() called before start()');
    }
  }, []);

  /**
   * measure: 태스크를 실행하고 TTI를 측정합니다.
   * 기본적으로 InteractionManager를 활용합니다.
   *
   * @param task - 측정할 작업 함수
   * @returns 측정 취소 함수
   */
  const measure = useCallback(
    (task: () => void) => {
      start();

      try {
        // 작업 실행
        task();

        if (options.useInteractionManager) {
          // InteractionManager를 활용한 측정 종료
          const handle = InteractionManager.runAfterInteractions(() => {
            stop();
          });

          // 취소 핸들러 설정
          cancelRef.current = () => {
            if (handle && handle.cancel) {
              handle.cancel();
            }
            setMeasuring(false);
          };

          return cancelRef.current;
        } else {
          // 즉시 측정 종료 (기본 방식)
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
   * 측정 취소 함수
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

  // 측정 결과와 제어 함수 반환
  return {
    tti,
    measuring,
    start,
    stop,
    measure,
    cancel,
  };
}
