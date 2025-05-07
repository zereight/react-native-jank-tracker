/**
 * JS 스레드를 일정 시간 블록하여 jank를 시뮬레이션합니다.
 *
 * @param durationMs 블록할 시간(ms), 기본값 100ms
 */
export function simulateJSJank(durationMs: number = 100) {
  const startTime = performance.now();
  while (performance.now() - startTime < durationMs) {
    // JS 스레드 블로킹
  }
  console.log(`Simulated JS jank for ${durationMs}ms`);
}
