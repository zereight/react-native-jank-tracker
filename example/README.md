This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# React Native Jank Tracker 예제 애플리케이션

이 예제는 react-native-jank-tracker 라이브러리를 사용하여 React Native 앱의 UI 성능을 모니터링하는 방법을 보여줍니다.

## 포함된 예제

### 1. 기본 TTI 측정 (Basic TTI Measurement)

`useTTIMeasure` 훅을 사용한 간단한 TTI 측정 예제입니다. 작업 시작과 종료 시점을 수동으로 명시하여 측정합니다.

```jsx
import { useTTIMeasure } from 'react-native-jank-tracker';

function MyComponent() {
  const { tti, start, stop } = useTTIMeasure();
  
  const handleButtonPress = () => {
    // 측정 시작
    start();
    
    // 작업 수행
    performHeavyTask();
    
    // 측정 종료
    stop();
    
    // tti 값에 작업 소요 시간이 밀리초 단위로 저장됨
    console.log(`작업 소요 시간: ${tti}ms`);
  };
  
  return (
    <Button onPress={handleButtonPress} title="작업 실행" />
  );
}
```

### 2. 고급 TTI 측정 (Advanced TTI Measurement)

`InteractionManager`를 활용한 고급 TTI 측정 예제입니다. 네이티브 이벤트 타임스탬프부터 JS 스레드가 한가해지는 시점까지의 시간을 측정합니다.

```jsx
import { InteractionManager, GestureResponderEvent } from 'react-native';

function handleTouchStart(e: GestureResponderEvent) {
  // 네이티브 이벤트 타임스탬프 저장
  const nativeTS = e.nativeEvent.timestamp;
  
  // 작업 수행
  performHeavyTask();
  
  // InteractionManager를 통해 JS 스레드가 한가해질 때까지 대기
  InteractionManager.runAfterInteractions(() => {
    // 인터랙션 완료 시점
    const jsReadyTS = performance.now();
    
    // TTI 계산
    const tti = jsReadyTS - nativeTS;
    console.log(`TTI: ${tti.toFixed(1)}ms`);
  });
}
```

## Jank 모니터링

애플리케이션 전체에서 Jank 이벤트(프레임 드롭)를 실시간으로 모니터링합니다. 화면 하단에 최근 감지된 Jank 정보가 표시됩니다.

```jsx
import { JankTrackerProvider, JankContext } from 'react-native-jank-tracker';
import { useContextSelector } from 'use-context-selector';

function App() {
  const lastJank = useContextSelector(JankContext, v => v?.lastJank);
  
  return (
    <JankTrackerProvider>
      <YourApp />
      {lastJank && (
        <Text>마지막 Jank: {lastJank.delta.toFixed(1)}ms</Text>
      )}
    </JankTrackerProvider>
  );
}
```

## 실행 방법

```bash
# 의존성 설치
yarn install

# iOS 시뮬레이터에서 실행
yarn ios

# Android 에뮬레이터에서 실행
yarn android
```
