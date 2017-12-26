import { StackNavigator } from 'react-navigation';
import {AppRegistry} from 'react-native'

// import beacon from './app/screens/beacons-page'
// AppRegistry.registerComponent('reactNativeBeaconExample', () => beacon);

import App from './app/index'

// import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue';
// MessageQueue.spy(true);

AppRegistry.registerComponent('reactNativeBeaconExample', () => App);





// import React, { Component } from 'react';
// import { WebView ,AppRegistry} from 'react-native';

// class MyWeb extends Component {
//   render() {
//     return (
//       <WebView
// source={require('./home.html')}
//         style={{marginTop: 20}}
//       />
//     );
//   }
// }

//  AppRegistry.registerComponent('reactNativeBeaconExample', ()=> MyWeb);