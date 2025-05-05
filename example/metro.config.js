const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const srcPath = path.resolve(__dirname, '../src');
const libName = 'react-native-jank-tracker';

// Metro가 src 경로에서 모듈 탐색하도록 커스텀 설정
const customConfig = {
  watchFolders: [srcPath],
  resolver: {
    extraNodeModules: {
      [libName]: srcPath,
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
      'use-context-selector': path.resolve(
        __dirname,
        'node_modules/use-context-selector',
      ),
    },
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName.startsWith(`${libName}/`)) {
        const subPath = moduleName.substring(libName.length + 1);
        const possibleExtensions = ['.ts', '.tsx', '.js', '.jsx'];
        for (const ext of possibleExtensions) {
          const potentialPath = path.resolve(srcPath, `${subPath}${ext}`);
          if (fs.existsSync(potentialPath)) {
            console.log(
              `[Metro Resolver] Resolving ${moduleName} to ${potentialPath}`,
            );
            return {
              filePath: potentialPath,
              type: 'sourceFile',
            };
          }
        }
        console.warn(
          `[Metro Resolver] Could not find ${subPath} in ${srcPath} for ${moduleName}`,
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

const config = customConfig;

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
