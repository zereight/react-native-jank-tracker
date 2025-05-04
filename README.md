# React Native Jank Tracker

React Native 애플리케이션의 TTI(Time to Interactive) 및 성능 측정을 위한 라이브러리입니다.

## 설치

```bash
npm install react-native-jank-tracker
# 또는
yarn add react-native-jank-tracker
```

## 주요 기능

### TTI(Time to Interactive) 측정

이 라이브러리는 React Native 앱에서 정확한 상호작용 시간을 측정하는 기능을 제공합니다. 기본적으로 InteractionManager를 활용한 고급 측정 방식을 사용하여 실제 사용자 체감 응답성을 정확하게 측정합니다.

## 사용 방법

### 기본 사용법 (권장)

`useTTIMeasure` 훅의 `measure` 함수를 사용하여 간단하게 작업의 실행 시간을 측정할 수 있습니다:

```jsx
import { useTTIMeasure } from 'react-native-jank-tracker';

function MyComponent() {
  const { tti, measuring, measure, cancel } = useTTIMeasure();

  const handleTask = () => {
    // measure 함수에 측정할 작업을 콜백으로 전달
    measure(() => {
      // 이 곳에 측정할 작업 코드를 작성
      performHeavyTask();
      // 작업이 완료된 후 InteractionManager를 통해 UI 스레드가
      // 완전히 응답 가능해질 때까지 자동으로 기다린 후 측정 완료
    });

    // 필요한 경우 측정 취소 가능
    // cancel();
  };

  return (
    <View>
      <Button onPress={handleTask} title="작업 실행" />
      {measuring && <Text>측정 중...</Text>}
      {tti !== null && <Text>소요 시간: {tti.toFixed(1)} ms</Text>}
    </View>
  );
}
```

### 고급 사용법

기본 측정 방식(InteractionManager 없이)만 필요한 경우:

```jsx
// InteractionManager 없이 JavaScript 실행 시간만 측정
const { tti, measuring, measure } = useTTIMeasure({ useInteractionManager: false });

// 또는 수동으로 start/stop 사용
const { tti, start, stop } = useTTIMeasure();

const handleManualMeasurement = () => {
  start();
  // 작업 수행
  performTask();
  stop();
};
```

## 측정 방식의 차이점

### 기본 측정 방식 (useInteractionManager: false)

- **측정 대상**: JavaScript 스레드에서의 작업 실행 시간만 측정
- **결과 의미**: 순수한 JavaScript 연산 시간
- **사용 사례**: 단순한 함수 실행 시간 측정, 기본적인 성능 테스트

### 고급 측정 방식 (useInteractionManager: true, 기본값)

- **측정 대상**: JavaScript 작업 + UI 스레드 작업 완료 시간을 포함한 총 시간
- **결과 의미**: 사용자가 실제로 경험하는 앱의 응답 시간에 가까운 값
- **사용 사례**: 실제 앱 사용 시나리오에서의 사용자 체감 성능 측정

### 왜 InteractionManager를 사용한 측정이 더 정확한가?

React Native는 여러 스레드에서 작동합니다:

1. **JavaScript 스레드**: JavaScript 코드 실행 및 Virtual DOM 계산
2. **Main(UI) 스레드**: 실제 네이티브 UI 렌더링
3. **Shadow 스레드**: 레이아웃 계산

기본 측정 방식은 JavaScript 스레드의 작업만 측정하지만, 실제로 사용자 입력 후 UI가 응답 가능해지려면 모든 스레드의 작업이 완료되어야 합니다. InteractionManager는 이러한 모든 작업이 완료될 때까지 기다린 후 측정을 종료하므로, 실제 사용자 경험에 가장 가까운 TTI 값을 제공합니다.

## API 참조

### useTTIMeasure(options)

```typescript
function useTTIMeasure(options?: {
  useInteractionManager?: boolean; // 기본값: true
}): {
  tti: number | null; // 측정된 TTI 값 (null이면 아직 측정되지 않음)
  measuring: boolean; // 측정 중 여부
  start: (timestamp?: number) => void; // 측정 시작 함수
  stop: () => void; // 측정 종료 함수
  measure: (task: () => void) => () => void; // 작업 측정 함수
  cancel: () => void; // 측정 취소 함수
};
```

## 예제

더 자세한 사용 예제는 `/example` 디렉토리에서 확인하실 수 있습니다.

## 라이센스

MIT
