/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {JankTrackerProvider} from 'react-native-jank-tracker';

// TTI 측정 예제 컴포넌트들
import BasicTTIMeasure from './components/BasicTTIMeasure';
import AdvancedTTIMeasure from './components/AdvancedTTIMeasure';

// 탭 타입
type TabName = 'basic' | 'advanced';

const App = () => {
  // 활성화된 탭
  const [activeTab, setActiveTab] = useState<TabName>('basic');

  // 탭 전환 핸들러
  const switchTab = (tab: TabName) => setActiveTab(tab);

  return (
    <JankTrackerProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>React Native Jank Tracker</Text>

          {/* 탭 전환 UI */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'basic' && styles.activeTab]}
              onPress={() => switchTab('basic')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'basic' && styles.activeTabText,
                ]}>
                기본 측정
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'advanced' && styles.activeTab]}
              onPress={() => switchTab('advanced')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'advanced' && styles.activeTabText,
                ]}>
                고급 측정
              </Text>
            </TouchableOpacity>
          </View>

          {/* 선택된 탭에 따라 예제 표시 */}
          <View style={styles.exampleContainer}>
            {activeTab === 'basic' ? (
              <BasicTTIMeasure />
            ) : (
              <AdvancedTTIMeasure />
            )}
          </View>
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
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  exampleContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default App;
