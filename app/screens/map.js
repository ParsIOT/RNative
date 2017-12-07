import React, { Component } from 'react';
import { WebView ,AppRegistry} from 'react-native';

class MyWeb extends Component {
  render() {
    return (
      <WebView
source={require('../../home.html')}
        style={{marginTop: 20}}
      />
    );
  }
}
export default MyWeb;