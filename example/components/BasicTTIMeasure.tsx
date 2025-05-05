import React, {useState} from 'react';
import {StyleSheet, Text, Pressable, View} from 'react-native';
import {useTTIMeasure} from 'react-native-jank-tracker/useTTIMeasure';

// Function to simulate random delay
const simulateDelay = () => {
  const delay = Math.random() * 300 + 500;
  const startTime = performance.now();
  while (performance.now() - startTime < delay) {
    // Empty loop to block JS thread
  }
};

const BasicTTIMeasure = () => {
  // Using TTI measurement hook
  const {tti, start, stop} = useTTIMeasure();
  // Measurement state
  const [measuring, setMeasuring] = useState(false);
  // Error state
  const [error, setError] = useState<Error | null>(null);

  const handlePress = () => {
    try {
      setMeasuring(true);
      start();

      // Call delay simulation function
      simulateDelay();

      stop();
      setMeasuring(false);
    } catch (err) {
      console.error('Error in TTI measurement:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setMeasuring(false);
    }
  };

  // Display error UI if an error occurred
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>An Error Occurred</Text>
        <Text style={styles.errorMessage}>Error while measuring TTI.</Text>
      </View>
    );
  }

  return (
    <>
      <Text style={styles.title}>Basic TTI Measurement</Text>
      <Text style={styles.description}>
        Directly calls start() and stop() functions to measure Time To
        Interactive (TTI).
      </Text>
      <View style={styles.buttonRow}>
        <Pressable
          style={({pressed}) => [
            styles.button,
            measuring && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handlePress}
          android_ripple={{color: '#ccc'}}
          disabled={measuring}>
          <Text style={styles.buttonLabel}>
            {measuring ? 'Running...' : 'Run Random JS Task'}
          </Text>
        </Pressable>
      </View>
      {tti !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.result}>TTI: {tti.toFixed(1)} ms</Text>
          <Text style={styles.resultDescription}>
            This represents the time it took from the start of the operation to
            its completion.
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
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A5B4FC',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  result: {
    fontSize: 22,
    color: '#0369a1',
    fontWeight: '700',
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#7F1D1D',
    textAlign: 'center',
  },
});

export default BasicTTIMeasure;
