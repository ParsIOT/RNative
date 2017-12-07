'use strict';
 import React, {Component}  from 'react';
 import {ToastAndroid,TextInput,Button,Dimensions,AppRegistry,StyleSheet,Text,ListView,View,DeviceEventEmitter,Alert,PermissionsAndroid} from 'react-native';
 var wifi=require('react-native-android-wifi')
 import * as Progress from 'react-native-progress';
 import { StackNavigator } from 'react-navigation';
// var ProgressBar = require('react-native-progress-bar');
// import * as ProgressBar from 'react-native-progress-bar'



class learn_class extends Component {

  constructor(props){
    super(props)
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state={
      mydata:ds.cloneWithRows([]),
      mydata2:[],
      dataSource: ds.cloneWithRows([]),
      serverData:[0,0,0,0,0,0,0,0,0,0],
      progress:0,
      pressed:false,
      x_input:0,
      y_input:0,
      editable:true, // for editing text input
    }

    setInterval(()=>{
      this._getUpdate()
    },250)

    
  }
    
  _sendToServer=(position)=>{                                                                   // the function to send tracking
    // this._getUpdate();
     var wifis_list=[];                                                                          // the wifi list (mac and rssi)
     this.state.mydata2.map((data)=>{wifis_list.push({"mac":data.BSSID,"rssi":data.level})});    //we push our distinct mac and rssi of every wifi to a list to input it to json
                                                                                                // prepairing the json :
     var mydict={
     "group":"kjj_wifi_group",
     "username":"kjj",
     "location":position,
     "time":12309123,
     "wifi-fingerprint":wifis_list}
     var myjson=JSON.stringify(mydict)    
    //  console.log(myjson)
                                                                                              // send myjson to server
     fetch("http://104.237.255.199:18003/learn",{
      method:"POST",
      body: myjson
    }).then((response)=>console.log(response))
   }
  
  
  

  _learn=()=>{
    this.setState({pressed:true})
    this.setState({editable:false})
    var count=-1;
    var rep = setInterval(()=>{
      count++;
      this._sendToServer( this.state.x_input + "," + this.state.y_input );
      // Sending to server
      this.setState(previousState=>{return{progress:previousState.progress+0.1}}) 
      if (count===9){
      // Sending to server 
      this._sendToServer( this.state.x_input + "," + this.state.y_input );      
      this.setState(previousState=>{return{progress:previousState.progress+0.1}})
      this.setState({progress:0})       
      this.setState({pressed:false})
      ToastAndroid.show('Learning Done  !', ToastAndroid.SHORT);
      this.setState({editable:true})
      clearInterval(rep)}
    },3000)
  }


  _buttonPressed(){

    if (this.state.pressed){
      return <Progress.Bar width={Dimensions.get('window').width-5} progress={this.state.progress}/>
      }
    else
    {
      return <Button onPress={this._learn}  title="Learn ! "/>
    }
  }

  _getUpdate=()=>{
  wifi.reScanAndLoadWifiList((wifiStringList) => {
    var wifiArray = JSON.parse(wifiStringList);
    this.setState({
      mydata: this.state.dataSource.cloneWithRows(wifiArray),
      mydata2: wifiArray
    });
    // console.log('Detected wifi networks - ',wifiArray);
  },
  (error) => {
    console.log(error)});

  }

  

  componentDidMount(){
    
    PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, { 'title': 'Cool Photo App Camera Permission', 'message': 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.' } ).then((response)=>console.log(response)).catch(err=>Alert.alert(err))
    PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, { 'title': 'Cool Photo App Camera Permission', 'message': 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.' } ).then((response)=>console.log(response)).catch(err=>Alert.alert(err))
    // PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.BODY_SENSORS, { 'title': 'Cool Photo App Camera Permission', 'message': 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.' } ).then((response)=>console.log(response)).catch(err=>Alert.alert(err))
  }

   render(){
    
    // const { navigate } = this.props.navigation;

     return (
      <View style={styles.container}>


      {/* <Text style={styles.headline}>*** All Wifi routers Around ***</Text> */}
      {/* <ListView
            dataSource={ this.state.mydata }
            enableEmptySections={ true }
            renderRow={this.renderRow}
          />  */}


          
      {/* <View style={{flexDirection:'row',justifyContent: 'space-around',alignItems: 'center',paddingBottom:20}}>
        <View style={{width:100,height:40,backgroundColor:'white'}}></View>
        <View style={{width:100,height:40,backgroundColor:'white'}}></View>
      </View> */}

      <View style={{flexDirection:'row',justifyContent: 'space-around',alignItems: 'center',paddingBottom:20}}>
        <TextInput editable={this.state.editable} onChangeText={(x)=>this.state.x_input=x} style={{width:120,height:120,color:'black',backgroundColor:'white',textAlign:'center',borderRadius:100,fontSize:22}} placeholder="x"/>
        <TextInput editable={this.state.editable} onChangeText={(y)=>this.state.y_input=y} style={{width:120,height:120,color:'black',backgroundColor:'white',textAlign:'center',borderRadius:100,fontSize:22,borderBottomColor:'red'}} placeholder="y"/>
      </View>

      {this._buttonPressed()}
        </View>

      )
    }

   renderRow=rowdata=>{
    return(
      <View style={styles.row}>
      <Text style={styles.smallText}>SSID :  {rowdata.SSID}</Text>
      <Text style={styles.smallText}>RSSI :  {rowdata.level}</Text>
      <Text style={styles.smallText}>BSSID :  {rowdata.BSSID}</Text>
      <Text style={styles.smallText}>Capabilities  :  {rowdata.capabilities}</Text>
      <Text style={styles.smallText}>Frequency :  {rowdata.frequency}</Text>
      <Text style={styles.smallText}>Timestamp :  {rowdata.timestamp}</Text>
      </View>
    )

   }

 }

 const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingTop: 60,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#1c2c58'
    //#1c2c58
  },
  btleConnectionStatus: {
    // fontSize: 20,
    paddingTop: 20
  },
  headline: {
    fontSize: 20,
    paddingBottom: 20,
    textAlign: 'center',
    color:'white'
    
  },
  row: {
    padding: 8,
    paddingBottom: 20,
    //paddingTop : 16,
    shadowColor: 'black',
    shadowOffset:{  width: 10,  height: 10,  },
    flex:2,
    backgroundColor:'#415939',
    //borderRadius:10
    //borderRadius: 2, //borderWidth: 3, //borderColor: '#d6d7da',
    borderBottomWidth:2,borderBottomColor:'white'
  },
  smallText: {
    fontSize: 11,
    color:'white'
  }
});

// export const reactNativeBeaconExample = StackNavigator({
//   Home: { screen: wifi_class },
// });

export default learn_class;
//  AppRegistry.registerComponent('reactNativeBeaconExample', ()=> learn_class);