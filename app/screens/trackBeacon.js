'use strict';
import React, {Component} from 'react';
import {  StyleSheet,Text,
  ListView,View, DeviceEventEmitter,
  Alert, PermissionsAndroid, WebView } from 'react-native';
import Beacons from 'react-native-beacons-manager';


export default class Beacon_class extends Component {
  static navigationOptions = {title:'TBeacon'};   
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
    dataSource: ds.cloneWithRows([]),
    myData2:[],
    num:0,
    result_x:0,
    result_y:0,
    average:{},
//  mac_list:[0,[0,
//   'FA:CF:CB:5D:0E:B8',
//   'FA:C5:13:37:F5:09',
//   'F0:AB:CE:31:10:B9',
//   'CB:16:FA:98:34:D7',
//   'EE:FA:1C:0E:68:BF',
//   'D2:AC:7C:25:36:FA',
//   'CD:35:23:69:6B:69',
//   'EC:7D:1E:28:F0:06',
  
//  ]],
    mac_list:[0,[0,
      '01:17:C5:97:E7:B3',
      '01:17:C5:97:1B:44',
      '01:17:C5:97:87:84',
      '01:17:C5:97:58:C3',
      '01:17:C5:97:DE:E8',
      '01:17:C5:97:5B:1D',
      '01:17:C5:97:B5:70',
      '01:17:C5:97:44:BE'
    ]],
      };

     setInterval(() => {
      this._sendToServer()
      }, 1500 );
    
  }


   componentWillMount() {
    
     Beacons.detectIBeacons();
     const uuid = this.state.uuidRef;
     Beacons.startMonitoringForRegion(null).catch((err)=>console.log("***startmonitoringError : "+err));
     Beacons.startRangingBeaconsInRegion(
         'REGION1',
        null
       )
       .then(
         () => console.log('Beacons ranging started succesfully')
       )
       .catch(
         error => console.log(`Beacons ranging not started, error: ${error}`)
       );

   }


   _sendToServer=()=>{
      var beacons_list = [];
      var temp = this.state.myData2 ;
                                                                              // the wifi list (mac and rssi)
      temp.map((data)=>{
        if (data.major===1){
          beacons_list.push({ "mac" : this.state.mac_list [ parseInt(data.major)][ parseInt(data.minor)] , "rssi":data.rssi} )};    //we push our (mac and rssi) of every wifi to a list to pass it to json
        })
        // console.log(temp)
      var mydict = {                                                   // prepairing the json :
        "group" : "arman_20_7_96_ble_2" ,
        "username":"hadi",
        "location":"0,0",
        "time":12309123,
        "wifi-fingerprint" : beacons_list  }

      var myjson = JSON.stringify(mydict)
      // console.log(myjson)
      console.log(Date.now())
      fetch("http://104.237.255.199:18003/track",{                           // send myjson to server
        method:"POST",
        body: myjson })
        .then((response)=>{
            // console.log(response) 
            return (JSON.stringify(eval("(" + response._bodyInit + ")")))})      // get the response and change("") around json to ('') to able to parse it
        .then((r2)=>JSON.parse(r2))
        .then((r3)=>{
        var temp1 = r3.knn.split( "," )                                          // split x and y
        this.setState({ result_x : temp1[0], result_y : temp1[1]})
        }).then(()=>this.refs.webview.postMessage( "" + this.state.result_x + "," + this.state.result_y ))
        .catch((err)=>{
                          console.log(err+"  Again is sending ...")
                         
                          this._sendToServer()})

   }
   

    componentDidMount() {
      PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, { 'title': 'Cool Photo App Camera Permission', 'message': 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.' } ).then((response)=>console.log(response)).catch(err=>Alert.alert(err))
      PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, { 'title': 'Cool Photo App Camera Permission', 'message': 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.' } ).then((response)=>console.log(response)).catch(err=>Alert.alert(err))
      this.beaconsDidRange = DeviceEventEmitter.addListener(
        'beaconsDidRange',
        (data) => {
        // var wifiArray = JSON.parse(data);
          this.setState({
            myData2: data.beacons,
            dataSource: this.state.dataSource.cloneWithRows(data.beacons)
          });  
          // console.log(this.state.mydata2)
        }
      )
    }

    componentWillUnMount(){
      this.beaconsDidRange = null;
    }

    onMessage=(data)=>{
      console.log(data.nativeEvent.data)
    }

    render() {
      const { dataSource } =  this.state;
      return (
        <WebView
        source={require('../static/TrackBeacon.html')}
        ref="webview"
        style={{marginTop: 0}}
        onMessage={this.onMessage}
        javaScriptEnabledAndroid={true}
        />
      );
    }

//    renderRow = rowData => { 

//     if (rowData && rowData.major === 1){
//      return (
//        <View style={styles.row}>

//         <Text style={styles.smallText}>
//         MAC  : {this.state.mac_list[rowData.major][rowData.minor] ? this.state.mac_list[rowData.major][rowData.minor] : 'NA'}
//         </Text>
//          <Text style={styles.smallText}>
//            UUID: {rowData.uuid ? rowData.uuid  : 'NA'}
//          </Text>
//          <Text style={styles.smallText}>
//            Major: {rowData.major ? rowData.major : 'NA'}
//          </Text>
//          <Text style={styles.smallText}>
//            Minor: {rowData.minor ? rowData.minor : 'NA'}
//          </Text>
//          <Text style={styles.smallText}>
//            RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
//          </Text>
//          <Text style={styles.smallText}>
//            Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
//          </Text>
//          <Text style={styles.smallText}>
//            Distance: {rowData.accuracy ? rowData.accuracy.toFixed(2) : 'NA'}m
//          </Text>
//        </View>
//      );
//    } else {return null}
//   }

  }



 const styles = StyleSheet.create({
    ontainer: {
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

