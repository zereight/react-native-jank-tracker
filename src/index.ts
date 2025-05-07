import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { JankMonitor } = NativeModules;
const jankEmitter = JankMonitor ? new NativeEventEmitter(JankMonitor) : null;

export function startJankMonitoring() {
  if (JankMonitor && JankMonitor.startJankMonitoring) {
    JankMonitor.startJankMonitoring();
  }
}

export function stopJankMonitoring() {
  if (JankMonitor && JankMonitor.stopJankMonitoring) {
    JankMonitor.stopJankMonitoring();
  }
}

export function onJankDetected(callback: (event: any) => void) {
  if (!jankEmitter) return { remove: () => {} };
  const sub = jankEmitter.addListener('NativeJankDetected', callback);
  return sub;
}

export function simulateNativeJank(durationMs: number) {
  if (JankMonitor && JankMonitor.simulateNativeJank) {
    JankMonitor.simulateNativeJank(durationMs);
  }
}

export { simulateJSJank } from './simulateJSJank';

export { JankContext } from './JankContext';
export { default as FrameStatsProvider } from './FrameStatsProvider';
export { measureTTI } from './measureTTI';
export type { JankEvent, JankContextValue } from './JankContext';
export { isJank } from './FrameStatsProvider';
