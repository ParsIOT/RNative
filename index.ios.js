'use strict';
import React, {Component} from 'react';
import {AppRegistry,
    StyleSheet, Text,
    ListView, View, DeviceEventEmitter,
    Alert, WebView,
} from 'react-native';  //PermissionsAndroid
// import {StackNavigator, TabNavigator, DrawerNavigator} from 'react-navigation'
// var Beacons = require('react-native-ibeacon')
// //import Beacons from 'react-native-beacons-manager'

// export default class Beacon_class extends Component {
//     static navigationOptions = {title: 'TBeacon'};

//     constructor(props) {
//         super(props);
//         var ds = new ListView.DataSource({
//             rowHasChanged: (r1, r2) => r1 != r2
//         });
//         this.state = {
//             dataSource: ds.cloneWithRows([]),
//             myData2: [],
//             num: 0,
//             result_x: 0,
//             result_y: 0,
//             average: {},
//             repeate: {},
// //  mac_list:[0,[0,
// //   'FA:CF:CB:5D:0E:B8',
// //   'FA:C5:13:37:F5:09',
// //   'F0:AB:CE:31:10:B9',
// //   'CB:16:FA:98:34:D7',
// //   'EE:FA:1C:0E:68:BF',
// //   'D2:AC:7C:25:36:FA',
// //   'CD:35:23:69:6B:69',
// //   'EC:7D:1E:28:F0:06',

// //  ]],
//             mac_list: [0, [0,
//                 '01:17:C5:97:E7:B3',
//                 '01:17:C5:97:1B:44',
//                 '01:17:C5:97:87:84',
//                 '01:17:C5:97:58:C3',
//                 '01:17:C5:97:DE:E8',
//                 '01:17:C5:97:5B:1D',
//                 '01:17:C5:97:B5:70',
//                 '01:17:C5:97:44:BE'
//             ]],
//         };

//         //  setInterval(() => {
//         //   this._sendToServer()
//         //   }, 1500 );


//         var count = 0;

//         var rep = setInterval(() => {
//             count++;
//             this._addToAverage(count)
//             // Sending to server *
//             if (count === 3) {
//                 this._addToAverage(count)
//                 // console.log(this.state.average)
//                 // console.log(this.state.repeate)
//                 this._sendToServer()
//                 console.log('done')
//                 count = 0
//                 this.setState({average: {}, repeate: {}})

//             }
//         }, 1000);
//     }


//     componentWillMount() {

//         Beacons.requestAlwaysAuthorization();
//         //Beacons.detectAltBeacons();
//         //Beacons.detectCustomBeaconLayout('m:0-3=4c000215,i:4-19,i:20-21,i:22-23,p:24-24');
//         // Define a region which can be identifier + uuid,
//         // identifier + uuid + major or identifier + uuid + major + minor
//         // (minor and major properties are numbers)
//         const region = {
//             identifier: 'GemTot for iOS',
//             uuid:   '23a01af0-232a-4518-9c0e-323fb773f5ef'   };
//         // Range for beacons inside the region
//         //Beacons.startMonitoringForRegion(region).catch((err) => console.log("***startmonitoringError : " + err));
//         Beacons.startMonitoringForRegion(region)
//         Beacons.startRangingBeaconsInRegion(region)
//         Beacons.startUpdatingLocation();

//     }


//     _addToAverage = (count) => {

//         //getUpdate
//         var temp = this.state.myData2
//         temp.map((data) => {
//             if (data.major === 1 && data.rssi !=0) {
//                 if (this.state.average[this.state.mac_list [parseInt(data.major)][parseInt(data.minor)]]) {
//                     this.state.average[this.state.mac_list [parseInt(data.major)][parseInt(data.minor)]] += data.rssi
//                     this.state.repeate[this.state.mac_list [parseInt(data.major)][parseInt(data.minor)]] += 1
//                     // console.log(count)
//                     // console.log(this.state.average)
//                 }
//                 else {
//                     // console.log(count)
//                     this.state.average[this.state.mac_list [parseInt(data.major)][parseInt(data.minor)]] = 0
//                     this.state.average[this.state.mac_list [parseInt(data.major)][parseInt(data.minor)]] += data.rssi
//                     this.state.repeate[this.state.mac_list [parseInt(data.major)][parseInt(data.minor)]] = 1
//                 }
//             }

//         })


//     }




//     _sendToServer = () => {
//         var beacons_list = [];
//         var temp = this.state.average;                                                                        // the wifi list (mac and rssi)
//         for (var mac in temp) {
//             beacons_list.push({"mac": mac, "rssi": Math.round(temp[mac] / this.state.repeate[mac])})
//         }

//         // console.log("\n beacons_list =>>>> ",beacons_list)
//         // console.log("temp =>>>>",temp)



//         // setting =>group, username, serverIp, add learn page, 

//         var mydict = {                                                   // prepairing the json :
//             "group": "arman_20_7_96_ble_2", //////
//             "username": "hadi",             //////
//             "location": "0,0",
//             "time": Date.now(),
//             "wifi-fingerprint": beacons_list
//         }


//         var myjson = JSON.stringify(mydict)
//         console.log(myjson)
//         // console.log(Date.now())
//         fetch("http://104.237.255.199:18003/track", {                           // send myjson to server
//             method: "POST",
//             body: myjson
//         })
//             .then((response) => {
//                 console.log(response)
//                 return (JSON.stringify(eval("(" + response._bodyInit + ")")))
//             })      // get the response and change("") around json to ('') to able to parse it
//             .then((r2) => JSON.parse(r2))
//             .then((r3) => {
//                 var temp1 = r3.knn.split(",")                                          // split x and y
//                 this.setState({result_x: temp1[0], result_y: temp1[1]})
//             }).then(() => this.refs.webview.postMessage("" + this.state.result_x + "," + this.state.result_y))
//             .catch((err) => {
//                 console.log(err + "  Again is sending ...")

//                 // this._sendToServer()
//             })

//     }


//     componentDidMount() {
//         //PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, { 'title': 'Cool Photo App Camera Permission', 'message': 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.' } ).then((response)=>console.log(response)).catch(err=>Alert.alert(err))
//         //PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, { 'title': 'Cool Photo App Camera Permission', 'message': 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.' } ).then((response)=>console.log(response)).catch(err=>Alert.alert(err))
//         this.beaconsDidRange = DeviceEventEmitter.addListener(
//             'beaconsDidRange',
//             (data) => {
//                 // var wifiArray = JSON.parse(data);
//                 this.setState({
//                     myData2: data.beacons,
//                     dataSource: this.state.dataSource.cloneWithRows(data.beacons)
//                 });
//                 // console.log(this.state.mydata2)
//             }
//         )
//     }

//     componentWillUnMount() {
//         this.beaconsDidRange = null;
//     }

//     onMessage = (data) => {
//         console.log(data.nativeEvent.data)
//     }

//     render() {
//         const {dataSource} = this.state;
//         return (
//             <WebView
//                source={require('./app/static/TrackBeacon.html')}
//                ref="webview"
//                style={{marginTop: 0}}
//                onMessage={this.onMessage}
//                javaScriptEnabled={true}
//             />

//             // <ListView 
//             //     dataSource={this.state.dataSource}
//             //     renderRow={this.renderRow}
//             //     enableEmptySections={true}
//             // />
//         );
//     }

//    renderRow = rowData => { 

//     if (rowData){
//         console.log(rowData)
//         //rowData.major === 1 || rowData.major==5
//      return (
//        <View style={styles.row}>

//         <Text style={styles.smallText}>
//         {/* MAC  : {this.state.mac_list[rowData.major][rowData.minor] ? this.state.mac_list[rowData.major][rowData.minor] : 'NA'} */}
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
//            RSSI: {rowData.rssi}
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

// }


// const styles = StyleSheet.create({
//     ontainer: {
//         flex: 1,
//         paddingTop: 0,
//         justifyContent: 'center',
//         alignItems: 'stretch',
//         backgroundColor: '#1c2c58'
//         //#1c2c58
//     },
//     btleConnectionStatus: {
//         // fontSize: 20,
//         paddingTop: 20
//     },
//     headline: {
//         fontSize: 20,
//         paddingBottom: 20,
//         textAlign: 'center',
//         color: 'white'

//     },
//     row: {
//         padding: 8,
//         paddingBottom: 20,
//         //paddingTop : 16,
//         shadowColor: 'black',
//         shadowOffset: {width: 10, height: 10,},
//         flex: 2,
//         backgroundColor: '#415939',
//         //borderRadius:10
//         //borderRadius: 2, //borderWidth: 3, //borderColor: '#d6d7da',
//         borderBottomWidth: 2, borderBottomColor: 'white'
//     },
//     smallText: {
//         fontSize: 11,
//         color: 'white'
//     }
// });


export default class hi extends Component<{}>{
    render(){
        return(
            hi
        )
    }
}

AppRegistry.registerComponent(
    'reactNativeBeaconExample',
    () => hi
);
