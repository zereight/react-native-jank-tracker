import React, {useContext} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {JankContext} from 'react-native-jank-tracker';

const screenWidth = Dimensions.get('window').width;
const TARGET_FPS_MS = 1000 / 60; // 60 FPS target in ms (approx. 16.7ms)

const FrameGraph = () => {
  const context = useContext(JankContext);
  const deltaHistory = context?.deltaHistory ?? [];

  // Prepare data for chart display (minimum 1 data point needed)
  const chartData = {
    labels: [], // Hide labels
    datasets: [
      {
        data: deltaHistory.length > 0 ? deltaHistory : [0], // Show 0 if no data
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // iOS Blue
        strokeWidth: 2,
      },
      {
        // 60 FPS target line (shown as dashed)
        data: Array(deltaHistory.length || 1).fill(TARGET_FPS_MS),
        color: (opacity = 1) => `rgba(255, 59, 48, ${opacity * 0.5})`, // iOS Red (semi-transparent)
        strokeWidth: 1,
        props: {strokeDasharray: [4, 4]}, // Dashed line effect
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Frame Interval (ms) Trend</Text>
      {deltaHistory.length > 0 ? (
        <LineChart
          data={chartData}
          width={screenWidth - 32} // Account for padding
          height={180}
          withDots={false} // Hide dots
          withInnerLines={false} // Hide inner grid lines
          withOuterLines={true}
          withHorizontalLabels={true} // Show vertical axis labels
          withVerticalLabels={false} // Hide horizontal axis labels
          yAxisInterval={1} // Vertical axis interval (adjust as needed)
          chartConfig={{
            backgroundColor: '#f0f0f0',
            backgroundGradientFrom: '#f0f0f0',
            backgroundGradientTo: '#f0f0f0',
            decimalPlaces: 1, // 1 decimal place
            color: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`, // Label color
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
          bezier // Curved graph
        />
      ) : (
        <Text style={styles.loadingText}>Collecting data...</Text>
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
