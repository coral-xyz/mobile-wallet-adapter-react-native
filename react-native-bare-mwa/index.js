/**
 * @format
 */

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Import the the ethers shims (**BEFORE** ethers)
import '@ethersproject/shims';

import {Buffer} from 'buffer';
global.Buffer = Buffer;

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
