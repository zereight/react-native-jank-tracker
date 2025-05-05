import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import {useTTIMeasure} from 'react-native-jank-tracker/useTTIMeasure';

/**
 * Advanced TTI measurement component using InteractionManager
 * - Records timestamp at interaction start
 * - Uses InteractionManager.runAfterInteractions() to wait until the JS thread is idle
 * - Calculates TTI based on the difference between completion and start time
 */
const AdvancedTTIMeasure = () => {
  // Using the useTTIMeasure hook
  const {tti, start, stop} = useTTIMeasure();
  // Measurement state
  const [measuring, setMeasuring] = useState(false);
  // Error state
  const [error, setError] = useState<string | null>(null);

  const handlePress = () => {
    if (measuring) {
      return;
    }

    try {
      // Start measurement
      setMeasuring(true);
      setError(null);

      // Use start function from useTTIMeasure to begin measurement
      start();

      // Artificially block JS thread for 1 second
      simulateHeavyTask(1000);

      // Wait until JS thread is idle
      InteractionManager.runAfterInteractions(() => {
        try {
          // Use stop function from useTTIMeasure to end measurement
          stop();
          setMeasuring(false);
        } catch (err) {
          setError('Error measuring interaction completion time');
          setMeasuring(false);
        }
      });
    } catch (err) {
      setError('Error during measurement');
      setMeasuring(false);
    }
  };

  /**
   * Simulate heavy task delay (blocks JS thread)
   */
  const simulateHeavyTask = (duration: number) => {
    const taskStartTime = performance.now();
    while (performance.now() - taskStartTime < duration) {
      // Empty loop to block JS thread
    }
  };

  return (
    <>
      <Text style={styles.title}>Advanced TTI Measurement</Text>
      <Text style={styles.description}>
        Uses InteractionManager to measure the time until the JS thread becomes
        idle. This provides a more accurate measurement of when the UI is fully
        responsive after a user interaction.
      </Text>

      <TouchableOpacity
        style={[styles.button, measuring && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={measuring}
        activeOpacity={0.7}>
        <Text style={styles.buttonLabel}>
          {measuring ? 'Measuring...' : 'Start InteractionManager Measurement'}
        </Text>
      </TouchableOpacity>

      {measuring && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.loadingText}>
            Waiting for JS thread to become idle...
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {tti !== null && !error && (
        <View style={styles.resultContainer}>
          <Text style={styles.result}>TTI: {tti.toFixed(1)} ms</Text>
          <Text style={styles.explanation}>
            (Time until the JS thread became completely idle)
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#666',
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
    alignSelf: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A7F3D0',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#f0f9f5',
    borderRadius: 8,
    padding: 16,
  },
  result: {
    fontSize: 22,
    color: '#10B981',
    fontWeight: '700',
  },
  explanation: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  errorContainer: {
    marginTop: 10,
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
});

export default AdvancedTTIMeasure;
