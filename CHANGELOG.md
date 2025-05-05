# Changelog

## [1.0.0] - 2025-05-05

### Major Features

- **JS-based Jank & FPS Detection**: Real-time detection and visualization of UI jank (frame drops) and frame intervals (FPS) using the JavaScript thread. Not native FPS.
- **TTI Measurement (JS-based)**: Accurately measure Time To Interactive (TTI) for any synchronous task using InteractionManager and high-resolution timers, all on the JS thread.
- **Frame Graph & Jank Simulation**: Visualize frame interval trends and simulate various levels of JS thread blocking to test app responsiveness.
- **Context API Integration**: Access frame/jank data anywhere in your app via React Context.
- **Example App**: Full-featured example app included for quick start and demonstration.

### Usage Notes

- **All measurements are JS thread-based.** This library does NOT measure native FPS or native TTI. It is designed for diagnosing JS-side performance issues in React Native apps.
- See [README.md](./README.md) for detailed architecture diagrams, usage, and API docs.

### Quick Install

```bash
yarn add react-native-jank-tracker
# or
npm install react-native-jank-tracker
```

### Documentation

- GitHub: https://github.com/zereight/react-native-jank-tracker
- See the "How it works / Architecture" section in the README for detailed explanations and diagrams.

---

Initial public release.
