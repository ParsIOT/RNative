'use strict';
 import React, {Component}  from 'react';
 import {AppRegistry,StyleSheet,Text,ListView,View,DeviceEventEmitter,Alert,PermissionsAndroid} from 'react-native';
 var wifi=require('react-native-android-wifi')



export default class wifi_class extends Component {

  // static navigationOptions = { title: 'wifi around', };
  constructor(props){
    super(props)
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2 })
      
    this.state={
      mydata:ds.cloneWithRows([]),
      mydata2:'',
      dataSource: ds.cloneWithRows([]),
      serverData:[0,0,0,0,0,0,0,0,0,0]
    }

    setInterval(()=>{
      this._getUpdate()
    },1000)

    var count=-1;
    setInterval(()=>{
      count++;
      this.state.serverData[count]=this.state.mydata2
      console.log('server data : ',this.state.serverData)
      if (count===9){
        this.state.serverData[count]=this.state.mydata2
        count=-1 ;
        console.log('sending to server ......')}
    },3000)
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
        <Text style={styles.headline}>*** All Wifi routers Around ***</Text>
      <ListView
            dataSource={ this.state.mydata }
            enableEmptySections={ true }
            renderRow={this.renderRow}
          /> 
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

 AppRegistry.registerComponent('reactNativeBeaconExample', ()=> wifi_class);