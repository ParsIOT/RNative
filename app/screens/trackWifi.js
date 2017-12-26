'use strict';
import React, {Component}  from 'react';
import {StyleSheet, Text,
        ListView, View,
        Alert,PermissionsAndroid, WebView } from 'react-native';
var wifi = require('react-native-android-wifi')



class track_class extends Component {

  componentDidMount(){
    PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, { 'title': 'Cool Photo App Camera Permission', 'message': 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.' } ).then((response)=>console.log(response)).catch(err=>Alert.alert(err))
    PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, { 'title': 'Cool Photo App Camera Permission', 'message': 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.' } ).then((response)=>console.log(response)).catch(err=>Alert.alert(err))
  }


 constructor(props){
    super(props)
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      mydata:ds.cloneWithRows([]),
      mydata2:[],
      dataSource: ds.cloneWithRows([]),
      result_x:0,
      result_y:0,  
    }

    setInterval(()=>{               // there is bug here i must convert my _sendToServer to a promise
      this._getUpdate() } ,500)

      setInterval(()=>{                
      this._sendToServer();} , 1000 );
    }
   


  _getUpdate = ()=> {                                              // a function to update the wifi list
    wifi.reScanAndLoadWifiList( (wifiStringList) => {            // scan wifis around
    var wifiArray = JSON.parse(wifiStringList);                  // generate "list" from json
    this.setState({
      mydata: this.state.dataSource.cloneWithRows(wifiArray),   // for showing in listView(not used)
      mydata2: wifiArray                                        // our wifi list state
            });  
    },
    (error) => {
      console.log(error)});
    }



 _sendToServer=(position)=>{      // the function to send tracking
    
    var wifis_list = [];
    var temp1 = this.state.mydata2;                                                                          // the wifi list (mac and rssi)
    temp1.map((data)=>{wifis_list.push({"mac":data.BSSID,"rssi":data.level})});    //we push our (mac and rssi) of every wifi to a list to pass it to json
                                                                                                
    var mydict = {                                                                // prepairing the json :
    "group" : "kjj_wifi_group" ,
    "username":"kjj",
    "location":position,
    "time":12309123,
    "wifi-fingerprint":wifis_list}

    var myjson = JSON.stringify(mydict)
                                                                             
    fetch("http://104.237.255.199:18003/track",{                           // send myjson to server
      method:"POST",
      body: myjson })
    .then((response)=>{
      // console.log(response) 
      return (JSON.stringify(eval("(" + response._bodyInit + ")")))})      // get the response and change("") around json to ('') to able to parse it
    .then((r2)=>JSON.parse(r2))
    .then((r3)=>{
      var temp1=r3.knn.split(",")                                          // split x and y
      this.setState({ result_x : temp1[0], result_y : temp1[1]})
      })
    .catch((err)=>console.log(err))

    this.refs.webview.postMessage( "" + this.state.result_x + "," + this.state.result_y )     
    

 }

  onMessage=(data)=>{
    console.log(data.nativeEvent.data)
  }

 // ####################################### ____design Items ___ ############################################

 renderRow=rowdata=>{
  return (
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

  render(){
    return (
      <View style={styles.container}>

        <WebView
        source={require('../static/home.html')}
        ref="webview"
        style={{marginTop: 0}}
        onMessage={this.onMessage}
        javaScriptEnabledAndroid={true}
        />
     
      </View>

     )
   }


}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   paddingTop: 0,
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






export default track_class;
// AppRegistry.registerComponent('reactNativeBeaconExample', ()=> track_class);