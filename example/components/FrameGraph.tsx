import React, {useContext} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {JankContext} from '../../src/JankContext';

const screenWidth = Dimensions.get('window').width;
const TARGET_FPS_MS = 1000 / 60; // 60 FPS 기준 ms (약 16.7ms)

const FrameGraph = () => {
  const context = useContext(JankContext);
  const deltaHistory = context?.deltaHistory ?? [];

  console.log('deltaHistory.length', deltaHistory.length);

  // 차트에 표시할 데이터 준비 (최소 1개의 데이터 필요)
  const chartData = {
    labels: [], // 라벨 숨김
    datasets: [
      {
        data: deltaHistory.length > 0 ? deltaHistory : [0], // 데이터가 없으면 0 표시
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // iOS Blue
        strokeWidth: 2,
      },
      {
        // 60 FPS 기준선 (점선으로 표시)
        data: Array(deltaHistory.length || 1).fill(TARGET_FPS_MS),
        color: (opacity = 1) => `rgba(255, 59, 48, ${opacity * 0.5})`, // iOS Red (반투명)
        strokeWidth: 1,
        props: {strokeDasharray: [4, 4]}, // 점선 효과
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>프레임 간격(ms) 추이</Text>
      {deltaHistory.length > 0 ? (
        <LineChart
          data={chartData}
          width={screenWidth - 32} // 좌우 패딩 고려
          height={180}
          withDots={false} // 점 숨김
          withInnerLines={false} // 내부 격자선 숨김
          withOuterLines={true}
          withHorizontalLabels={true} // 세로축 라벨 표시
          withVerticalLabels={false} // 가로축 라벨 숨김
          yAxisInterval={1} // 세로축 간격 (필요 시 조정)
          chartConfig={{
            backgroundColor: '#f0f0f0',
            backgroundGradientFrom: '#f0f0f0',
            backgroundGradientTo: '#f0f0f0',
            decimalPlaces: 1, // 소수점 1자리
            color: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`, // 라벨 색상
            labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
            style: {
              borderRadius: 8,
            },
            propsForBackgroundLines: {
              stroke: '#e0e0e0',
              strokeDasharray: '',
            },
          }}
          style={styles.chart}
          bezier // 곡선 그래프
        />
      ) : (
        <Text style={styles.loadingText}>데이터 수집 중...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default FrameGraph;
