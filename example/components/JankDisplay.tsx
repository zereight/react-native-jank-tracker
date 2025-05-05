import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {JankContext} from '../../src/JankContext';

const JankDisplay = () => {
  // Standard useContext usage
  const context = useContext(JankContext);
  const lastJank = context?.lastJank; // Get lastJank directly from context

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jank Detector</Text>
      {lastJank ? (
        <View style={styles.jankInfo}>
          <Text style={styles.jankText}>Last Jank Detected:</Text>
          <Text style={styles.jankDetail}>
            - Time: {new Date(lastJank.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      ) : (
        <Text style={styles.noJankText}>No Jank Detected</Text>
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
    color: '#D32F2F', // Red accent color
    fontWeight: '500',
  },
  noJankText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#4CAF50', // Green accent color
    fontStyle: 'italic',
  },
});

export default JankDisplay;
