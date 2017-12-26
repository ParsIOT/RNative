'use strict';

 import React, {Component} from 'react';
 import { StackNavigator } from 'react-navigation';
 import { AppRegistry, StyleSheet,Text,
  ListView,View, DeviceEventEmitter,
  Alert, PermissionsAndroid, WebView,
  Button } from 'react-native';
 import Beacons from 'react-native-beacons-manager';
 import Permissions from 'react-native-permissions';
 import {checkPermission} from 'react-native-android-permissions'
 import StackNavigation from 'react-navigation'
 import * as Progress from 'react-native-progress';
 


export default class Beacon_class extends Component {

  static navigationOptions = {title:'Lbeacons'};   
  constructor(props) {
     super(props);
     var ds = new ListView.DataSource({
       rowHasChanged: (r1, r2) => r1 !== r2 }
     );
     this.state = {
       // region information
       uuidRef: '7b44b47b-52a1-5381-90c2-f09b6838c5d4',  //23A01AF0-232A-4518-9C0E-323FB773F5EF
      photoPermission:'0,0',
      // React Native ListView datasource initialization
      dataSource: ds.cloneWithRows([]),
      nummydata: ds.cloneWithRows([]),
      mydata2: [],
      dataSource: ds.cloneWithRows([]),
      serverData:[0,0,0,0,0,0,0,0,0,0],
      progress: 0,
      pressed: false,
      x_input: 0,
      y_input: 0,
      editable: true, // for editing text input
      currentPosision: "0,0",
      mac_list:[0,[0,
        'FA:CF:CB:5D:0E:B8',
        'FA:C5:13:37:F5:09',
        'F0:AB:CE:31:10:B9',
        'CB:16:FA:98:34:D7',
        'EE:FA:1C:0E:68:BF',
        'D2:AC:7C:25:36:FA',
        'CD:35:23:69:6B:69',
        'EC:7D:1E:28:F0:06',
        
       ]],
     
       myData2:[],
      };

    //  setInterval(() => {
    //   this._sendToServer()
    //   }, 1000);
    
    
      // var count = 0;
    // var timerId = setInterval(function() {
    // if (count <= 6){
    //   clearInterval(timerId);
    //   count++;
      
    // }
    //  console.log("changed");
    // }, 3000/6);

  }


   componentWillMount() {
    
     Beacons.detectIBeacons();
     const uuid = this.state.uuidRef;
     Beacons.startMonitoringForRegion(null);
     Beacons
       .startRangingBeaconsInRegion(
         'REGION1',
        //  uuid
        null
       )
       .then(
         () => console.log('Beacons ranging started succesfully')
       )
       .catch(
         error => console.log(`Beacons ranging not started, error: ${error}`)
       );


   }

   _buttonPressed(){
    
        if (this.state.pressed){
          return<Text> Loading ... </Text>
          }
        else
        {
          return <Button style={{position:'absolute'}} onPress={this._learn}  title="Learn ! "/>
        }
      }


    _learn=()=>{
      this.setState({pressed:true})
      this.setState({editable:false})
      var count=-1;
      var rep = setInterval(()=>{
        count++;
  
        // this._sendToServer( this.state.x_input + "," + this.state.y_input );
        this._sendToServer(this.state.currentPosision)
  
        // Sending to server
        this.setState(previousState=>{return{progress:previousState.progress+0.1}}) 
        if (count===9){
        // Sending to server 
        this._sendToServer( this.state.x_input + "," + this.state.y_input );      
        this.setState(previousState=>{return{progress:previousState.progress+0.1}})
        this.setState({progress:0})       
        this.setState({pressed:false})
        // ToastAndroid.show('Learning Done  !', ToastAndroid.SHORT);
        this.setState({editable:true})
        clearInterval(rep)}
      },3000)
    }
    


   _sendToServer=(position)=>{
     
      var beacons_list = [];
      var temp=this.state.myData2                                                                          // the wifi list (mac and rssi)
      temp.map((data)=>{
        if (data.major<2){
          beacons_list.push({ "mac" : this.state.mac_list [ parseInt(data.major)][ parseInt(data.minor)] , "rssi":data.rssi} )};    //we push our (mac and rssi) of every wifi to a list to pass it to json
        })
      var mydict = {                                                   // prepairing the json :
        "group" : "kjj_beacon_group" ,
        "username":"kjj",
        "location": position ,
        "time":12309123,
        "wifi-fingerprint":beacons_list  }

      var myjson = JSON.stringify(mydict)
    //   console.log(beacons_list)


      fetch("http://104.237.255.199:18003/learn",{                           // send myjson to server
        method:"POST",
        body: myjson })
        .then((response)=>{
            console.log(response) 
        })
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
        }
      );
    }

    componentWillUnMount(){
      this.beaconsDidRange = null;
   }

   onMessage=(data)=>{
    this.setState({currentPosision: data.nativeEvent.data })
 }

    render() {
      const { dataSource } =  this.state;
      return (
        <View style={styles.container}>
        <Text style={{color:'white',paddingBottom:10,paddingTop:10,textAlign:'center'}}>{this.state.currentPosision}</Text>
  
  
        {/* <Text style={styles.headline}>*** All Wifi routers Around ***</Text> */}
        {/* <ListView
              dataSource={ this.state.mydata }
              enableEmptySections={ true }
              renderRow={this.renderRow}
            />  */}
  
  
        <WebView
          source={require('../static/LearnBeacon.html')}
          ref="webview"
          style={{marginTop: 0}}
          onMessage={this.onMessage}
          javaScriptEnabledAndroid={true}
          />
       

          {this._buttonPressed()}
        
        </View>
  
        )
    }

   renderRow = rowData => { 

    if (rowData && rowData.major==1){
     return (
       <View style={styles.row}>

        <Text style={styles.smallText}>
        MAC  : {this.state.mac_list[rowData.major][rowData.minor] ? this.state.mac_list[rowData.major][rowData.minor] : 'NA'}
        </Text>
         <Text style={styles.smallText}>
           UUID: {rowData.uuid ? rowData.uuid  : 'NA'}
         </Text>
         <Text style={styles.smallText}>
           Major: {rowData.major ? rowData.major : 'NA'}
         </Text>
         <Text style={styles.smallText}>
           Minor: {rowData.minor ? rowData.minor : 'NA'}
         </Text>
         <Text style={styles.smallText}>
           RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
         </Text>
         <Text style={styles.smallText}>
           Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
         </Text>
         <Text style={styles.smallText}>
           Distance: {rowData.accuracy ? rowData.accuracy.toFixed(2) : 'NA'}m
         </Text>
       </View>
     );
   } else {return null}
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





//  export const reactNativeBeaconExample = StackNavigator({
//   Home: { screen: Beacon_class },
// });

// AppRegistry.registerComponent('reactNativeBeaconExample', () => reactNativeBeaconExample);


// AppRegistry.registerComponent('reactNativeBeaconExample', ()=> Beacon_class);