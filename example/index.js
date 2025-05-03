/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { JankTrackerProvider } from 'react-native-jank-tracker';

const Root = () => (
  <JankTrackerProvider>
    <App />
  </JankTrackerProvider>
);

AppRegistry.registerComponent(appName, () => Root);
