import React from 'react';
import { View, Text, Button } from 'react-native';
import { JankTrackerProvider, useTTIMeasure } from '../src';

const ExampleComponent = () => {
  const { tti, start, stop } = useTTIMeasure();

  const handlePress = (e: any) => {
    start(e?.nativeEvent?.timestamp);
    setTimeout(() => {
      stop();
    }, Math.random() * 200 + 50); // 임의의 지연 시뮬레이션
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="TTI 측정 버튼" onPress={handlePress} />
      <Text style={{ marginTop: 20 }}>
        {tti !== null ? `TTI: ${tti.toFixed(1)}ms` : '버튼을 눌러 TTI 측정'}
      </Text>
    </View>
  );
};

const App = () => (
  <JankTrackerProvider>
    <ExampleComponent />
  </JankTrackerProvider>
);

export default App;
