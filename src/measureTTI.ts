import { InteractionManager } from 'react-native';

/**
 * measureTTI
 * Measures Time To Interactive (TTI) for a given synchronous task using InteractionManager.
 *
 * @param task - The function to execute and measure
 * @returns The measured TTI in milliseconds
 */
export function measureTTI(task: () => void): Promise<number> {
  const start = performance.now();
  task();
  return new Promise(resolve => {
    InteractionManager.runAfterInteractions(() => {
      const end = performance.now();
      resolve(end - start);
    });
  });
}
