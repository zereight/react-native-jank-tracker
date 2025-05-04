/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Pressable, TouchableHighlight, View } from 'react-native';
import { JankTrackerProvider, useTTIMeasure } from 'react-native-jank-tracker';

const App = () => {
  // TTI 측정 훅 사용
  const { tti, start, stop } = useTTIMeasure();
  // 측정 중 상태
  const [measuring, setMeasuring] = useState(false);

  console.log('tti', tti);

  return (
    <JankTrackerProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>TTI Measurement</Text>
        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              measuring && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              setMeasuring(true);
              start();
              // 랜덤 지연 시간(500~1500ms) 동안 블로킹 시뮬레이션
              const delay = Math.random() * 1000 + 500;
              const startTime = performance.now();
              while (performance.now() - startTime < delay) {}
              stop();
              setMeasuring(false);
            }}
            android_ripple={{ color: '#ccc' }}
            disabled={measuring}
          >
            <Text style={styles.buttonLabel}>
              {measuring ? 'Running...' : 'Run Random JS Task'}
            </Text>
          </Pressable>
          <View style={{ width: 16 }} />
          <TouchableHighlight
            style={[styles.button, measuring && styles.buttonDisabled]}
            underlayColor={'#374151'}
            onPress={() => {
              setMeasuring(true);
              start();
              // 랜덤 지연 시간(500~1500ms) 동안 블로킹 시뮬레이션
              const delay = Math.random() * 1000 + 500;
              const startTime = performance.now();
              while (performance.now() - startTime < delay) {}
              stop();
              setMeasuring(false);
            }}
            disabled={measuring}
          >
            <Text style={styles.buttonLabel}>
              {measuring ? 'Running...' : 'Run (Highlight)'}
            </Text>
          </TouchableHighlight>
        </View>
        {tti !== null && <Text style={styles.result}>TTI: {tti.toFixed(1)} ms</Text>}
      </SafeAreaView>
    </JankTrackerProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  result: {
    fontSize: 20,
    color: '#007AFF',
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
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default App;
