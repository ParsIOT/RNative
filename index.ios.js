'use strict';  //to do 
import React, {Component} from 'react';
import {
    StyleSheet,
        Text,
            ListView, 
                View, 
                    DeviceEventEmitter,
                        Alert, 
                            WebView, 
                                AsyncStorage,
AppRegistry
                            } from 'react-native';  

import {StackNavigator, TabNavigator, DrawerNavigator} from 'react-navigation'
//var Beacons = require('react-native-ibeacon')
import Beacons from 'react-native-beacons-manager'

export default class Beacon_class extends Component {
    static navigationOptions = {title: 'TBeacon'};
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2});  //it was for listView to show changes instantly
        this.state = {
            dataSource: ds.cloneWithRows([]),               //a container to store data in it 
            LU : {},                                        //least usage
            myData2: [],
            movings:{},
            result_x: 0,
            result_y: 0,
            average: {},
            repeate: {},
            beaconUnusage:{},
            percents : [   0.1148 , 0.3537 ],
            mac_list: [0, [0,
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

        // this.testMovingAverage()
        this.mainFunction()
        // console.log(this.Diff_list([1,2,3], [2,3]))
    }


    componentWillMount() {                      //In here before component is created 
                                                     //we request the phone(by java or object-c) to search for 
       	                                                // beacons and update 'beaconsDidRange' event
        Beacons.requestAlwaysAuthorization()
        Beacons.requestWhenInUseAuthorization()

        var region= {identifier:'REGION113',
        uuid: "23a01af0-232a-4518-9c0e-323fb773f5ef"}  
        Beacons.startMonitoringForRegion(region).catch((err) => console.log("*** startmonitoringError : " + err));
        Beacons.startRangingBeaconsInRegion(region)
            .then(
                () => console.log('Beacons ranging started succesfully')
            )
            .catch(
                error => console.log(`Beacons ranging not started, error: ${error}`)
            );

        Beacons.startUpdatingLocation()

    }


    componentDidMount() {       //after compontent is created we listen to device to changes and save them
        //PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,{ 'title': 'Cool Photo App Camera Permission', 'message': 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.' } ).then((response)=>console.log(response)).catch(err=>Alert.alert(err))
        //PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, { 'title': 'Cool Photo App Camera Permission', 'message': 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.' } ).then((response)=>console.log(response)).catch(err=>Alert.alert(err))
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

    componentWillUnMount() {                        //if called when the component is removed from the DOM
        this.beaconsDidRange = null;
    }


    updateMovingAverageList(mac, rssi){             // in this function we get mac and rssi 
                                                        //and update our dictionary of 
                                                           //  macs-rssis and delete fist one and push new one

        if (this.state.movings[mac]){
            this.state.movings[mac].splice(0,1)     //remove first item
            this.state.movings[mac].push(rssi)    // push new value
            // console.log(this.state.movings)
        }
        else {
            this.state.movings[mac] = [ rssi, rssi, rssi, rssi, rssi, rssi ]      //if it wasnt in dictionary we make a list of dumplicate rssi
            
            // console.log(this.state.movings)
        }
    }

    calculateMovingAverage(diff=[]){                    //here we multiply our ready macs to our percents and return a result of mac-rssis
        var result = []
        var mylist = []
        for(var j=0; j<diff.length; j++) delete this.state.movings[diff[j]]
        // console .log(this.state.movings)
        
        for (var mac in this.state.movings) {
            // if(mac in diff) delete this.state.movings[mac]
            mylist = this.state.movings[mac]
            var Rssi = 0
            // console.log(mylist)
            mylist= mylist.slice(mylist.length - this.state.percents.length)
            // console.log('the second => ',mylist)
            for (var p=0; p < this.state.percents.length; p++){
                Rssi += mylist[p] * this.state.percents[p]
            }
            var multiplierSum=0
            for (var item in this.state.percents ){ multiplierSum += this.state.percents[item]}
            // console.log(Rssi,'----',multiplierSum)
            Rssi=Rssi/multiplierSum
            // console.log(Rssi)
            result.push({"mac":mac, "rssi":Math.round(Rssi) })
        }
        // console.log(result)


        return result;
    }


    testMovingAverage(){                                //a test for moving average
        this.updateMovingAverageList('1','-20')
        this.updateMovingAverageList('1','-20')
        this.updateMovingAverageList('1','-90')
        this.updateMovingAverageList('2','-20')
        this.updateMovingAverageList('1','-30')

        console.log(this.calculateMovingAverage() )
        
    }

    
    

    mainFunction=  ()=>{        //it is our main control function it will addtoaverage in timeintervals and send to server depending on bundle size


        var count = 0;

        var rep = setInterval( () => {          
        count++;
        this._addToAverage()
        // Sending to server *
        if (count === 10 ) {   //bundle size
        var diff=this._addToAverage()
        // console.log(this.state.average)
        // console.log(this.state.repeate)
        this._sendToServer(diff)
        console.log('done')
        count = 0
        this.setState({average: {}, repeate: {}})

        }
        }, 300);  //todo: reduce check intervals to less than one minutes
        //scan intervals
    }

    _addToAverage = () => {

        //getUpdate
        var temp = this.state.myData2
        var datamacs=[]
        var returnValue=[]          //then return value is a list of macs that didnt appear more than 5 times
        
        temp.map((data) => {
            if (data.major === 1) { //because we had beacon with major=1000 in around i filter it to 1
                var major = parseInt(data.major)
                var minor = parseInt(data.minor)
                var mac= this.state.mac_list[major][minor]
                datamacs.push(mac)
                this.state.LU[mac] = 0                      //usage of this mac is zero because it is found now      
                //this.calculateUsage(mac)


                if (this.state.average[mac]) {                    //if it wasnt first time that this beacon's rssi is added so we add the rssi to previos amount and incremtn the repeate amount to get mean amount of each beacons at end
                    this.state.average[mac] += data.rssi
                    this.state.repeate[mac] += 1
                    // console.log(count)
                    // console.log(this.state.average)
                }
                else {
                    // console.log(count)
                    this.state.average[mac] = 0
                    this.state.average[mac] += data.rssi
                    this.state.repeate[mac] = 1
                    // console.log(this.state.average)
                }
            }

        })

        // console.log('before deleting = > ',this.state.LU)
        // console.log(this.state.LU)
        var diffs = this.Diff_list( Object.keys(this.state.LU) , datamacs )
        // console.logs(diffs)
        for (var m=0;m<diffs.length;m++){
            this.state.LU[diffs[m]]++;
            if (this.state.LU[diffs[m]]>5) 
                {
                    returnValue.push(diffs[m])
                    console.log('before => ', this.state.LU)
                    console.log('deleted item is : > ',diffs[m] )
                    delete this.state.LU[diffs[m]]
                    // console.log('after deleting = > ',this.state.LU)
                }
        }
        

        return returnValue
    }

    
    Diff_list(l1, l2){      //l1-l2
        var temp={}
        var diff=[]
        for (var i=0 ; i<l1.length ; i++){
            temp[l1[i]] = true
        }
        for (var j=0 ; j<l2.length ; j++){
            if (temp[l2[j]]){delete temp[l2[j]]}
        }

        for (var mac in temp){
            diff.push(mac)
        }
        return diff

    }


    _sendToServer =  (diff=null) => {
        var group =null
        var  username = null
         //storage.load({key:'GroupNameTrack'}).then((ret=>{group=ret}))         //we retrieve data from storage here
         //storage.load({key:'username'}).then((ret=>{username=ret}))
        

        // var beacons_list = [];              
        var temp = this.state.average;  
        // console.log(this.state.average)                                                                      
        for (var mac in temp) {
            console.log(23)
            // beacons_list.push({"mac": mac, "rssi": Math.round(temp[mac] / this.state.repeate[mac])})
            this.updateMovingAverageList( mac, Math.round(temp[mac] / this.state.repeate[mac] ))    // we add to the moving list the last rssi(which is devide at last)
        }

        // console.log(this.calculateMovingAverage())
        // console.log("\n beacons_list =>>>> ",beacons_list)
        // console.log("temp =>>>>",temp)
        var mydict = {                                                   // prepairing the json :
            "group": "arman_20_7_96_ble_2",         
            "username":"hadi",            
            "location": "0,0",
            "time": Date.now(),
            //"wifi-fingerprint": beacons_list 
            "wifi-fingerprint": this.calculateMovingAverage()                   //we calculate our last fingerprints according to our percents
            
        }


        var myjson = JSON.stringify(mydict)
        console.log(myjson)
        // console.log(Date.now())
        fetch("http://104.237.255.199:18003/track", {                           // send myjson to server
            method: "POST",
            body: myjson
        })
            .then((response) => {
                // console.log(response)
                return (JSON.stringify(eval("(" + response._bodyInit + ")")))
            })      // get the response and change("") around json to ('') to able to parse it
            .then((r2) => JSON.parse(r2))
            .then((r3) => {
                var temp1 = r3.knn.split(",")                                          // split x and y
                this.setState({result_x: temp1[0], result_y: temp1[1]})
            }).then(() => this.refs.webview.postMessage("" + this.state.result_x + "," + this.state.result_y))
            .catch((err) => {
                console.log(err + "  Again is sending ...")

                // this._sendToServer()
            })

    }


    

    onMessage = (data) => {                                         //the function to recieve message from webview
        console.log(data.nativeEvent.data)
    }

    render() {
        const {dataSource} = this.state;
        return (
           <WebView
               source={require('./app/static/TrackBeacon.html')}
                ref="webview"
               style={{marginTop: 0}}
               onMessage={this.onMessage}
                // javaScriptEnabledAndroid={true}
            />
                );
    }

   renderRow = rowData => { //this is for list view that determines the style and rendering of list items

    if (rowData && rowData.major === 1){ //23a01af0-232a-4518-9c0e-323fb773f5ef
        
        console.log(rowData.uuid) 
     return (
       <View style={styles.row}>

        {/* <Text style={styles.smallText}>
        MAC  : {this.state.mac_list[rowData.major][rowData.minor] ? this.state.mac_list[rowData.major][rowData.minor] : 'NA'}
        </Text> */}
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
        color: 'white'

    },
    row: {
        padding: 8,
        paddingBottom: 20,
        //paddingTop : 16,
        shadowColor: 'black',
        shadowOffset: {width: 10, height: 10,},
        flex: 2,
        backgroundColor: '#415939',
        //borderRadius:10
        //borderRadius: 2, //borderWidth: 3, //borderColor: '#d6d7da',
        borderBottomWidth: 2, borderBottomColor: 'white'
    },
    smallText: {
        fontSize: 11,
        color: 'white'
    }
});


AppRegistry.registerComponent(
    'reactNativeBeaconExample',
    () => Beacon_class
);
