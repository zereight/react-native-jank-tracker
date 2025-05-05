import React, {useState} from 'react';
import {StyleSheet, Text, Pressable, View} from 'react-native';
import {useTTIMeasure} from 'react-native-jank-tracker/useTTIMeasure';

// 랜덤 지연을 시뮬레이션하는 함수를 분리
const simulateDelay = () => {
  const delay = Math.random() * 300 + 500;
  const startTime = performance.now();
  while (performance.now() - startTime < delay) {
    // 빈 루프로 JS 스레드 블로킹
  }
};

const BasicTTIMeasure = () => {
  // TTI 측정 훅 사용
  const {tti, start, stop} = useTTIMeasure();
  // 측정 중 상태
  const [measuring, setMeasuring] = useState(false);
  // 에러 상태
  const [error, setError] = useState<Error | null>(null);

  const handlePress = () => {
    try {
      setMeasuring(true);
      start();

      // 지연 시뮬레이션 함수 호출 (try/catch 내부에서 조건문 제거)
      simulateDelay();

      stop();
      setMeasuring(false);
    } catch (err) {
      console.error('Error in TTI measurement:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setMeasuring(false);
    }
  };

  // 에러가 발생했으면 에러 UI 표시
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>오류가 발생했습니다</Text>
        <Text style={styles.errorMessage}>
          TTI 측정 중 문제가 발생했습니다.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Text style={styles.title}>기본 TTI 측정</Text>
      <Text style={styles.description}>
        start()와 stop() 함수를 직접 호출하여 간단하게 TTI를 측정합니다.
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
            {measuring ? '실행 중...' : '랜덤 JS 작업 실행'}
          </Text>
        </Pressable>
      </View>
      {tti !== null && (
        <Text style={styles.result}>TTI: {tti.toFixed(1)} ms</Text>
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
  result: {
    fontSize: 20,
    color: '#007AFF',
    marginTop: 10,
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
