import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {JankContext} from '../../src/JankContext';

const JankDisplay = () => {
  // 표준 useContext 사용
  const context = useContext(JankContext);
  const lastJank = context?.lastJank; // context에서 직접 lastJank 가져오기

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jank 감지기</Text>
      {lastJank ? (
        <View style={styles.jankInfo}>
          <Text style={styles.jankText}>마지막 버벅거림 감지:</Text>
          <Text style={styles.jankDetail}>
            - 시간: {new Date(lastJank.timestamp).toLocaleTimeString()}
          </Text>
          <Text style={styles.jankDetail}>
            - 프레임 간격: {lastJank.delta.toFixed(1)} ms
          </Text>
        </View>
      ) : (
        <Text style={styles.noJankText}>버벅거림(Jank) 감지되지 않음</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  jankInfo: {
    alignItems: 'center',
  },
  jankText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  jankDetail: {
    fontSize: 14,
    color: '#D32F2F', // 빨간색 계열로 강조
    fontWeight: '500',
  },
  noJankText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#4CAF50', // 녹색 계열
    fontStyle: 'italic',
  },
});

export default JankDisplay;
