const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const srcPath = path.resolve(__dirname, '../src');

// Metro가 src 경로에서 모듈 탐색하도록 커스텀 설정
const customConfig = {
  watchFolders: [srcPath],
  resolver: {
    extraNodeModules: {
      'react-native-jank-tracker': srcPath,
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
    },
  },
};

const config = customConfig;

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
