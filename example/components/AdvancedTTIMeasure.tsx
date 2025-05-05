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
 * InteractionManager를 활용한 고급 TTI 측정 컴포넌트
 * - 인터랙션 시작 시 타임스탬프를 기록
 * - InteractionManager.runAfterInteractions()를 통해 JS 스레드가 한가해질 때까지 대기
 * - 인터랙션 완료 시점과 시작 시점의 차이로 TTI 계산
 */
const AdvancedTTIMeasure = () => {
  // useTTIMeasure 훅 사용
  const {tti, start, stop} = useTTIMeasure();
  // 측정 중 상태
  const [measuring, setMeasuring] = useState(false);
  // 에러 상태
  const [error, setError] = useState<string | null>(null);

  const handlePress = () => {
    if (measuring) {
      return;
    }

    try {
      // 측정 시작
      setMeasuring(true);
      setError(null);

      // useTTIMeasure의 start 함수 사용하여 측정 시작
      start();

      // 인위적으로 1초간 JS 쓰레드 블로킹
      simulateHeavyTask(1000);

      // JS 쓰레드가 한가해질 때까지 기다림
      InteractionManager.runAfterInteractions(() => {
        try {
          // useTTIMeasure의 stop 함수 사용하여 측정 종료
          stop();
          setMeasuring(false);
        } catch (err) {
          setError('인터랙션 완료 시점 측정 중 오류 발생');
          setMeasuring(false);
        }
      });
    } catch (err) {
      setError('측정 중 오류 발생');
      setMeasuring(false);
    }
  };

  /**
   * 인위적인 작업 지연 시뮬레이션 (JS 쓰레드 블로킹)
   */
  const simulateHeavyTask = (duration: number) => {
    const taskStartTime = performance.now();
    while (performance.now() - taskStartTime < duration) {
      // 비어있는 루프로 JS 쓰레드 블로킹
    }
  };

  return (
    <>
      <Text style={styles.title}>고급 TTI 측정</Text>
      <Text style={styles.description}>
        InteractionManager를 활용하여 JS 스레드가 한가해지는 시점까지
        측정합니다. 이는 실제 앱에서 사용자 인터랙션 후 UI가 완전히 응답할 수
        있을 때까지 걸리는 시간을 더 정확하게 측정합니다.
      </Text>

      <TouchableOpacity
        style={[styles.button, measuring && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={measuring}
        activeOpacity={0.7}>
        <Text style={styles.buttonLabel}>
          {measuring ? '측정 중...' : 'InteractionManager 측정 시작'}
        </Text>
      </TouchableOpacity>

      {measuring && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.loadingText}>
            JS 스레드가 한가해질 때까지 대기 중...
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
            (JS 스레드가 완전히 한가해질 때까지의 시간)
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
  },
  result: {
    fontSize: 20,
    color: '#10B981',
    fontWeight: '500',
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
