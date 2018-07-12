import { AppRegistry, Platform } from 'react-native';
import App from './src/App';
import KeyboardManager from 'react-native-keyboard-manager'

AppRegistry.registerComponent('hasBrain', () => App);
Platform.OS === 'ios' && KeyboardManager.setToolbarPreviousNextButtonEnable(true);
