# 로컬 개발 가이드

## 1. 라이브러리 빌드 및 배포

1. 루트 디렉터리에서 의존성 설치

   ```bash
   yarn
   ```

2. 라이브러리 빌드 (TypeScript 컴파일)

   ```bash
   yarn build
   ```

3. 베타 버전 업데이트 및 배포
   ```bash
   yarn beta
   ```
   - `sync:podspec`: `node scripts/update-podspec.js` (prepublishOnly 훅으로 npm publish 시 자동 실행)
   - `beta:version`: `npm version prerelease --preid=beta`
   - `beta:publish`: `npm publish --tag beta`
   - `beta`: 위 스크립트 연속 실행

## 2. Example 프로젝트에 설치

1. `example` 폴더로 이동

   ```bash
   cd example
   ```

2. 라이브러리 설치

   ```bash
   npm install react-native-jank-tracker@beta
   ```

   또는

   ```bash
   yarn add react-native-jank-tracker@beta
   ```

3. iOS CocoaPods 설치 (iOS 개발 시)

   ```bash
   cd ios && pod install && cd ..
   ```

4. 앱 실행
   ```bash
   yarn ios
   # 또는
   yarn android
   ```

## 3. 스크립트 및 버전 관리

- `package.json` 참고:

  - `build`
  - `sync:podspec`
  - `prepublishOnly`
  - `beta:version`
  - `beta:publish`
  - `beta`

- 베타 버전은 `yarn beta` 실행 시마다 자동으로 증가되며, podspec 동기화도 자동으로 수행되므로 수동 변경이 필요 없습니다.

## 4. Podspec 변환 (필요 시)

현재 `react-native-jank-tracker.podspec`은 별도 변환이 필요 없습니다.  
추가 수정이 필요하면 알려주세요.

## 5. 로컬 예제 프로젝트에서 테스트

### A. 배포된 Beta 버전 설치 및 테스트

1. `example` 폴더로 이동
   ```bash
   cd example
   ```
2. 라이브러리 설치
   ```bash
   yarn add react-native-jank-tracker@beta
   ```
3. iOS CocoaPods 설치 (iOS 개발 시)
   ```bash
   cd ios && pod install && cd ..
   ```
4. 앱 실행
   ```bash
   yarn ios      # iOS 실행
   yarn android  # Android 실행
   ```
