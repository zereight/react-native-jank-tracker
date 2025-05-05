# React Native Jank Tracker

A lightweight library for tracking, visualizing, and simulating UI jank (frame drops) and measuring Time To Interactive (TTI) in React Native apps.

---

## Demo

![Demo](./demo.gif)

---

## Features

- **Jank Detection**: Detects and displays UI jank events in real time.
- **Frame Graph**: Visualizes frame interval trends.
- **Jank Simulation**: Simulate various levels of JS thread blocking.
- **TTI Measurement**: Measure Time To Interactive (TTI) using InteractionManager for realistic results.
- **Easy Integration**: Simple API.

---

## Installation

```bash
yarn add react-native-jank-tracker
# or
npm install react-native-jank-tracker
```

---

## Quick Start

1. **Wrap your app with the provider (required for jank/frame context):**

```tsx
import JankTrackerProvider from 'react-native-jank-tracker/JankTrackerProvider';

const App = () => <JankTrackerProvider>{/* ...your app... */}</JankTrackerProvider>;
```

2. **Measure TTI for a task:**

```tsx
import { measureTTI } from 'react-native-jank-tracker';

async function handleTTI() {
  const tti = await measureTTI(() => {
    // ...simulate heavy work or render...
  });
  console.log('TTI:', tti, 'ms');
}
```

> **Note:** `measureTTI` does **not** require the Provider. However, if you want to use jank/frame context (`JankContext`), you must wrap your app with `JankTrackerProvider`.

---

## API

### `JankTrackerProvider`

Wraps your app and provides jank/frame data via context. Required if you want to use `JankContext` or visualize frame/jank data globally.

### `measureTTI(task)`

Measures Time To Interactive (TTI) for a given synchronous task using **InteractionManager**.

- **Parameters:**
  - `task`: A synchronous function to execute and measure (e.g. rendering, heavy computation)
- **Returns:**
  - `Promise<number>`: The measured TTI in milliseconds

#### **Example**

```tsx
import { measureTTI } from 'react-native-jank-tracker';

async function handleTTI() {
  const tti = await measureTTI(() => {
    // ...simulate heavy work or render...
  });
  console.log('TTI:', tti, 'ms');
}
```

- The function uses `performance.now()` for high-resolution timing.
- It always waits for all UI/JS work to finish before stopping the timer (using `InteractionManager.runAfterInteractions`).

### `JankContext`

Access frame/jank data anywhere in your app (requires Provider).

---

## Example App

A full-featured example app is included in the `example/` directory. It demonstrates:

- Real-time jank detection and frame graph
- Jank simulation buttons
- TTI measurement

To run the example:

```bash
cd example
# iOS
yarn ios
# Android
yarn android
```

---

## Requirements

- React Native 0.79+
- React 19+

---

## Troubleshooting

### Metro server port already in use

If you see an error like:

```
error listen EADDRINUSE: address already in use :::8081
```

It means another Metro server is already running. You can stop it with:

```bash
lsof -i :8081
# Find the PID and kill it:
kill -9 <PID>
```

Or simply close any other running Metro/React Native dev servers.

---

## License

MIT
