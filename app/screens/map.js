import React, { Component } from 'react';
import { WebView ,AppRegistry,Button, View} from 'react-native';

class MyWeb extends Component {

  constructor(props){
    super(props)
    this.state={
      clicked:0
    }

  }

  _onPress=()=>{
    this.setState({ clicked : this.state.clicked+200 });
    this.refs.webview.postMessage(this.state.clicked);
    console.log(this.state.clicked)

  }
  render() {
    const jsCode = `var myX = 0`;
    return (
      <View style={{flex:1}}>
      <Button onPress={this._onPress} title="press me"/>
      <WebView
        source={require('../../home.html')}
        ref="webview"
        style={{marginTop: 0}}
        javaScriptEnabledAndroid={true}
        
      />
      </View>
    );
  }
}
export default MyWeb;