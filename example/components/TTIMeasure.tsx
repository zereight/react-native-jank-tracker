import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {measureTTI} from 'react-native-jank-tracker';

/**
 * Simulate heavy JS task (blocks thread)
 */
const simulateHeavyTask = (duration: number) => {
  const taskStartTime = performance.now();
  while (performance.now() - taskStartTime < duration) {
    // Empty loop to block JS thread
  }
};

const TTIMeasure = () => {
  const [tti, setTTI] = useState<number | null>(null);
  const [measuring, setMeasuring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePress = async () => {
    setMeasuring(true);
    setError(null);
    setTTI(null);
    try {
      const result = await measureTTI(() => {
        simulateHeavyTask(1000);
      });
      setTTI(result);
    } catch (err) {
      setError('Error while measuring TTI.');
    } finally {
      setMeasuring(false);
    }
  };

  return (
    <>
      <Text style={styles.description}>
        Measures Time To Interactive (TTI) using InteractionManager after a
        heavy JS task (1s block).
      </Text>

      <TouchableOpacity
        style={[styles.button, measuring && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={measuring}
        activeOpacity={0.7}>
        <Text style={styles.buttonLabel}>
          {measuring ? 'Measuring...' : 'Start TTI Measurement'}
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

export default TTIMeasure;
