# Jank Tracking 실행 계획

앱 UI 쓰레드의 프레임 지연(jank)과 사용자 체감 성능 지표를 측정하기 위한 3단계 계획 문서입니다.

---

## 1단계와 2단계 차이

- **1단계 (JankTracker)**: `requestAnimationFrame` 루프를 통해 매 프레임 간격을 측정해, 60fps(16ms) 초과하는 전역 프레임 드롭(jank)을 감지합니다.
- **2단계 (TTI 측정)**: 사용자의 특정 인터랙션(`onTouchStart`) 이후 `InteractionManager.runAfterInteractions` 완료 시점까지 걸린 시간을 측정해, 실제 동작 플로우의 지연(Time-to-Interactive)을 파악합니다.

두 단계를 함께 적용하면, 연속적인 프레임 드롭과 사용자 액션 단위 지연을 모두 종합적으로 모니터링할 수 있습니다.

---

## 1단계: requestAnimationFrame 기반 JankTracker 도입

**목적**
- 네이티브 렌더링 쓰레드에서 매 프레임 간격을 측정해, 60fps(16ms) 이상 소요되는 프레임을 `Jank 이벤트`로 로깅합니다.

**방법**
1. `app/util/JankTracker.tsx` 파일 생성
2. `useEffect`에서 `requestAnimationFrame` 루프를 실행
3. 이전 호출 시각과 현재 시각의 차이를 계산하여 16ms 초과 시 로그 출력
4. `index.js`에서 루트 컴포넌트를 `JankTracker`로 래핑하여 전역 모니터링

```tsx
// app/util/JankTracker.tsx
import React, { useRef, useEffect } from 'react';

const JankTracker: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const lastTs = useRef<number>(Date.now());

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const now = Date.now();
      const delta = now - lastTs.current;
      if (delta > 16) {
        console.log(`[Jank] frame took ${delta.toFixed(1)}ms`);
      }
      lastTs.current = now;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <>{children}</>;
};
export default JankTracker;
```

```tsx
// index.js (루트 등록 예시)
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import JankTracker from 'app/util/JankTracker';

const Root = () => (
  <JankTracker>
    <App />
  </JankTracker>
);
AppRegistry.registerComponent(appName, () => Root);
```

**장단점**
- **장점**
  - 매우 간단한 구현: 순수 JS(`requestAnimationFrame`)만으로 동작해 네이티브 모듈 추가 불필요
  - 전역 모니터링: 앱 전체 프레임 드롭을 한 곳에서 로그로 종합 파악 가능
  - 프로덕션 안전: `__DEV__` 모드 등으로 운영 환경에 영향 없이 사용

- **단점**
  - JS 스레드 기준 측정: 네이티브 렌더링·레이아웃 지연(C++/GPU) 감지 불가
  - 해상도 한계: `Date.now()` 단위 측정으로 아주 짧은 지연(<1ms) 놓칠 수 있고, 16~50ms 경미한 드롭은 필터링 필요
  - 분석·시각화 한계: 단순 콘솔 로그 만으로는 장기 추세 및 근본 원인 분석이 어려워 추가 도구 병행 필요

---

## 2단계: InteractionManager 기반 TTI 측정

**목적**
- 사용자가 초기 인터랙션(버튼 클릭, 스크롤 등)을 수행한 후, JS 스레드가 한가해지는 시점까지의 시간을 `Time to Interactive(TTI)`로 측정합니다.

**방법**
1. 주요 인터랙션 핸들러(예: `onPress`)에서 `e.nativeEvent.timestamp`와 `performance.now()`를 저장
2. `InteractionManager.runAfterInteractions()` 내부 콜백 시점에 다시 `performance.now()`를 찍어, 브리지 이후도 포함한 전체 지연을 계산

```tsx
import { InteractionManager, GestureResponderEvent } from 'react-native';

function onUserAction(e: GestureResponderEvent) {
  const nativeTS = e.nativeEvent.timestamp;

  InteractionManager.runAfterInteractions(() => {
    const jsReadyTS = performance.now();
    const tti = jsReadyTS - nativeTS;
    console.log(`TTI_latency=${tti.toFixed(1)}ms`);
  });
}
```

**장단점**
- **장점**
  - 정확한 인터랙션 완성 시점 파악: 사용자의 액션 후 JS가 실제로 대응 가능한 시점을 측정해 TTI 확보
  - 순수 JS만으로 도입 가능: 별도 네이티브 모듈 추가 없이 `InteractionManager`로 구현
  - 유연한 지표 통합: 특정 화면이나 컴포넌트 단위로 측정 포인트 설정 가능

- **단점**
  - UI 스레드 렌더링 지연 미포함: JS 스레드 준비 시점을 측정하나 네이티브 레이아웃/렌더링 지연은 감지 불가
  - InteractionManager 스케줄 의존: 시스템 부하나 JS 큐 스케줄러 상태에 따라 측정값이 달라질 수 있음
  - 단발성 이벤트 한계: 버튼 클릭 등 개별 이벤트 단위 측정만 가능하며, 연속적인 jank 패턴 탐지는 별도 프레임 모니터링 필요

---

## 3단계: Flipper/React Native 성능 모니터 활용

**목적**
- 네이티브 레벨에서 UI 쓰레드와 JS 쓰레드의 프레임 시간, CPU 사용량 등을 시각화·분석하여 더 심층적인 jank 원인 분석을 지원합니다.

**방법**
- Flipper 설치 후 Performance 플러그인 활성화
- 개발자 메뉴의 FPS 모니터 켜기 (`Dev Settings → Show Perf Monitor`)
- Android: `adb shell setprop debug.hwui.profile visual_lines && adb shell input keyevent 84`
- iOS: Xcode의 Debug GPU Frame Capture 사용
- Systrace: `npx react-devtools-core --open` 또는 `perfetto`를 통해 네이티브 렌더링 콜스택 프로파일링

---

### 차례대로 도입 및 검증
1. **1단계**: JankTracker로 전역 프레임 드롭 로그 확인
2. **2단계**: 주요 인터랙션 TTI_latency 로그 확인
3. **3단계**: Flipper/Perf Monitor와 Systrace로 네이티브 퍼포먼스 세부 분석

---

## 추가 측정 방법

- **방법**
  - React Native 개발자 메뉴의 FPS 모니터 켜기
    (`Dev Settings → Show Perf Monitor`)

  - Android 측정 방법:
    1. 기기 설정 → 개발자 옵션 → **GPU 렌더링 프로파일링 표시** 활성화
       - 화면 상단에 프레임별 그래픽 처리 시간(녹색/노란색/빨간색 바) 표시
    2. `adb shell dumpsys gfxinfo <패키지명> framestats` 실행
       ```bash
       adb shell dumpsys gfxinfo com.example.app framestats > framestats.txt
       ```
       생성된 `framestats.txt`로 프레임 렌더링 타임라인 분석 가능
    3. Perfetto 사용 예시:
       ```bash
       adb root
       adb shell perfetto -c - --txt > trace.txt <<EOF
       buffers { size_kb: 10240 fill_policy: RING_BUFFER }
       data_sources {
         config { name: "linux.ftrace" ftrace_config { ftrace_events: "sched/sched_switch" ftrace_events: "gfx/frame" } }
       }
       EOF
       ```
       `trace.txt`를 perfetto UI에 업로드해 GPU/CPU 프로파일링 진행

  - iOS 측정 방법:
    1. Xcode → Product → Profile → Instruments 실행
    2. **Core Animation** 템플릿 선택 후 녹화(start) 클릭
       - FPS 차트에서 프레임 드롭(프레임당 ms)을 시각적으로 확인
    3. **Time Profiler**로 JS 및 네이티브 콜스택 샘플링
    4. Xcode GPUDebugger(⌘I)로 GPU Frame Capture 사용해 렌더패스 분석