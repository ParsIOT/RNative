'use strict';
import React, {Component}  from 'react';
import {StyleSheet, Text,
        ListView, View,
        Alert,PermissionsAndroid, WebView, NativeModules } from 'react-native';
var wifi = require('react-native-android-wifi')
const IOSWifiManager = NativeModules.IOSWifiManager





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
      average:{},
      repeate:{}  
    }

    setInterval(()=>{               // there is bug here i must convert my _sendToServer to a promise
      this._getUpdate() } ,500)

      // setInterval(()=>{                
      // this._addToAverage();} , 1000 );
    


      var  count=0
      var rep = setInterval(()=>{
        count++;
        this._addToAverage(count)
        // Sending to server *
        if (count === 3){
          this._addToAverage(count)
          // console.log(this.state.average)
          // console.log(this.state.repeate)
          this._sendToServer()
          console.log('done')
          count = 0
          this.setState({average:{},repeate:{}})
        }
      },1000);
  }


  _getUpdate = ()=> {                                              // a function to update the wifi list
    wifi.reScanAndLoadWifiList( (wifiStringList) => {            // scan wifis around
    var wifiArray = JSON.parse(wifiStringList);                  // generate "list" from json
    this.setState({
      mydata: this.state.dataSource.cloneWithRows(wifiArray),   // for showing in listView(not used)
      mydata2: wifiArray                                        // our wifi list state
            }); 
            // console.log(wifiArray) 
    },
    (error) => {
      console.log(error)});
    }


    _addToAverage=(count)=>{
      
      // this._getUpdate()
      // console.log(this.state.mydata2)
      
      var temp = this.state.mydata2
      // console.log(this.state.mydata2)
      temp.map((data)=>{
        
          if (this.state.average[data.BSSID] ){
              this.state.average[data.BSSID] += data.level
              this.state.repeate[data.BSSID ] +=1
            
            // console.log(this.state.average)  
          }
          else {
            // console.log(count)  
            this.state.average[ data.BSSID] = 0
            this.state.average[ data.BSSID ] += data.level
            this.state.repeate[ data.BSSID ] = 1
          }
        
      
      })
  
  
    }
 _sendToServer=(position)=>{      // the function to send tracking
    
    var wifis_list = [];
    // console.log(this.state.average)
    var temp1 = this.state.average ;                                                                          // the wifi list (mac and rssi)
    for (var data in temp1){ wifis_list.push({"mac":data,"rssi": Math.round( temp1[data]/this.state.repeate[data] ) })};    //we push our (mac and rssi) of every wifi to a list to pass it to json
      // console.log( wifis_list )                                                                                         
    var mydict = {
                                                                    // prepairing the json :
    "group" : "kjj_wifi_group" ,
    "username":"kjj",
    "location":position,
    "time":12309123,
    "wifi-fingerprint":wifis_list }

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