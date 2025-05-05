/**
 * React Native Jank Tracker Example
 *
 * GIF for README: Jank Simulation 탭에 JankDisplay, FrameGraph, 시뮬레이션 버튼이 모두 포함됩니다.
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import JankTrackerProvider from 'react-native-jank-tracker/JankTrackerProvider';
import JankDisplay from './components/JankDisplay';
import FrameGraph from './components/FrameGraph';
import TTIMeasure from './components/TTIMeasure';

// Tab types
const TABS = [
  {key: 'jank-simulation', label: 'Jank Simulation'},
  {key: 'tti', label: 'TTI Measurement'},
];

type TabKey = (typeof TABS)[number]['key'];

// Jank simulation function
const simulateJank = (durationMs = 100) => {
  const startTime = performance.now();
  while (performance.now() - startTime < durationMs) {
    // JS thread blocking
  }
  console.log(`Simulated jank for ${durationMs}ms`);
};

const App = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('jank-simulation');

  // 각 탭별 렌더링 함수
  const renderTabContent = () => {
    switch (activeTab) {
      case 'jank-simulation':
        return (
          <>
            <View style={styles.tabTitleContainer}>
              <Text style={styles.tabTitle}>Jank Simulation</Text>
              <Text style={styles.tabDesc}>
                Simulate different levels of JS thread blocking, and monitor
                jank events and frame intervals in real time.
              </Text>
            </View>
            <View style={styles.centeredContent}>
              <JankDisplay />
              <View style={styles.jankChartSpacer} />
              <FrameGraph />
              <View style={styles.jankChartSpacer} />
              <View style={styles.simButtonCol}>
                <TouchableOpacity
                  style={[styles.simButton, styles.lightJankButton]}
                  onPress={() => simulateJank(100)}>
                  <Text style={styles.simButtonText}>
                    Simulate Light Jank (100ms)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.simButton, styles.mediumJankButton]}
                  onPress={() => simulateJank(500)}>
                  <Text style={styles.simButtonText}>
                    Simulate Medium Jank (500ms)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.simButton, styles.heavyJankButton]}
                  onPress={() => simulateJank(2000)}>
                  <Text style={styles.simButtonText}>
                    Simulate Heavy Jank (2000ms)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );
      case 'tti':
        return (
          <>
            <View style={styles.tabTitleContainer}>
              <Text style={styles.tabTitle}>TTI Measurement</Text>
            </View>
            <View style={styles.centeredContent}>
              <TTIMeasure />
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <JankTrackerProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>React Native Jank Tracker</Text>
        </View>
        <View style={styles.tabBar}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key as TabKey)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          {renderTabContent()}
        </ScrollView>
      </SafeAreaView>
    </JankTrackerProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#2563EB',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  tabTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  tabTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  tabDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 0,
    textAlign: 'center',
    maxWidth: 320,
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  simButtonCol: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  simButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 14,
    alignItems: 'center',
    width: 260,
  },
  lightJankButton: {
    backgroundColor: '#dbeafe',
  },
  mediumJankButton: {
    backgroundColor: '#fef3c7',
  },
  heavyJankButton: {
    backgroundColor: '#fee2e2',
  },
  simButtonText: {
    fontWeight: '500',
    fontSize: 15,
    color: '#222',
  },
  jankChartSpacer: {
    height: 16,
  },
});

export default App;
