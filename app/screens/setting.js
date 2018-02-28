'use strict';
import React, {Component} from 'react';
import { StyleSheet,Text,
ListView,View, DeviceEventEmitter,
Alert, PermissionsAndroid, WebView,
Button,
Image,
TextInput,
ScrollView,
AsyncStorage,
TouchableNativeFeedback,
Vibration} from 'react-native';

import Storage from 'react-native-storage'


const storage = new Storage({
    size:20,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
    
})
export{storage}





export default class Setting extends Component {
    static navigationOptions = {title:'SETTING'}; 
          
    constructor(props){
        super(props)
        this.state={
            username : 'hadi',
                GroupNameTrack : 'arman_23_9_96_ble_2',
                    GroupNameLearn : 'None',
                        ServerAddress : '104.237.255.199:18003',
                            ScanInterval : 300,
                                BundleSize : 10,
                                    HowManyBundleLearn : 10,
                                        loading: 1,
           


        }

        
     this.loadData()
     
        
    }



    saveItems = async () => {
        let itemsKey= Object.keys(this.state)
        let itemsValue= Object.values(this.state)

        for (var i=0 ; i<7 ; i++){
            try{
                if (i==6){
                    console.log(itemsKey[i] + '-->' + Object.values(this.state)[i])                    
                    await storage.save({ key:itemsKey[i], data:itemsValue[i] })
                    await Alert.alert('saving Done :)')
                }
                else{
                console.log(itemsKey[i] + '-->' + Object.values(this.state)[i])                    
                await storage.save({ key:itemsKey[i], data:itemsValue[i] })
                }
            }
            catch(error){console.log('error in Save Items :'+ error)}
}
            }





    
    loadData = async  () =>{
                try{

                    await this.loadItem('username')
                    await this.loadItem('GroupNameLearn')
                    await this.loadItem('GroupNameTrack')
                    await this.loadItem('ServerAddress')
                    await this.loadItem('ScanInterval')
                    await this.loadItem('BundleSize')
                    await this.loadItem('HowManyBundleLearn')
                    await this.setState({ loading : 0 })
                          
                }catch(error){console.log(error)}


            
    }

    
    loadItem(key){
        storage.load({
            key: key,
            autoSync: true, })
        .then(value => {
            this.setState({[key]:value})
                        ;})
        .catch(err => {
            console.warn(err.message);
            switch (err.name) {
                case 'NotFoundError':
                console.log('not found')
                    storage.save({key:key, data:this.state[key]})
                    break;
                case 'ExpiredError':
                    // TODO
                    break;
            }
        })
    }

    


    render(){
        if (this.state.loading){
            
            return (
                <View style={{flex:1, flexDirection: 'column', justifyContent:'center', alignItems:'center'}}> 
                    <Image source={require('../static/laoding.png')} style={{width:100 , height: 100}}/>
                    <Text style={{fontSize:25}}> Loading Data </Text> 
                </View> )}
        else{

            return(
            <View style={{flex:1}}>

            <ScrollView style={{paddingBottom:50}}>  
            <View style={{flex:1, marginBottom:20}}>
                <Text style={{paddingBottom:10, paddingTop:10}}> SERVER SETTING </Text>
                <Text style={{fontWeight: "bold"}}> username </Text>
                <TextInput 
                    underlineColorAndroid='black' 
                    defaultValue = {this.state.username} 
                    style={{ paddingLeft:10}}  
                    onChangeText = { (text)=>{ this.setState({username : text })} }
                />

                <Text style={{fontWeight: "bold"}}> GroupNameLearn </Text>
                <TextInput underlineColorAndroid='black' 
                    onChangeText = { (text)=>{ this.setState({GroupNameLearn : text })} } 
                    style={{ paddingTop:5 ,paddingLeft:10}}
                    defaultValue = {this.state.GroupNameLearn}
                 />

                <Text style={{fontWeight: "bold"}}> GroupNameTrack </Text>
                <TextInput underlineColorAndroid='black' 
                    onChangeText = { (text)=>{ this.setState({GroupNameTrack : text })} } 
                    style={{ paddingTop:5 ,paddingLeft:10}}
                    defaultValue = {this.state.GroupNameTrack}
                 />

                <Text style={{fontWeight: "bold"}}> ServerAddress </Text>
                <TextInput underlineColorAndroid='black' 
                    onChangeText = { (text)=>{ this.setState({ServerAddress : text })} } 
                    style={{ paddingTop:5 ,paddingLeft:10}}
                    defaultValue = {this.state.ServerAddress}
                 />

                <Text style={{fontWeight: "bold"}}> ScanInterval(ms) </Text>
                <TextInput underlineColorAndroid='black' 
                    onChangeText = { (text)=>{ this.setState({ScanInterval : text })} }
                    keyboardType={'numeric'}                    
                    style={{ paddingTop:5 ,paddingLeft:10}}
                    defaultValue = {(this.state.ScanInterval.toString())}
                 />

                <Text style={{fontWeight: "bold"}} > BundleSize </Text>
                <TextInput underlineColorAndroid='black' 
                    onChangeText = { (text)=>{ this.setState({BundleSize : text })} } 
                    keyboardType={'numeric'}                    
                    style={{ paddingTop:5 ,paddingLeft:10}}
                    defaultValue = {(this.state.BundleSize.toString())}
                 />

                <Text style={{fontWeight: "bold"}}> HowManyBundleLearn </Text>
                <TextInput underlineColorAndroid='black' 
                    onChangeText = { (text)=>{ this.setState({HowManyBundleLearn : text })} } 
                    keyboardType={'numeric'}
                    style={{ paddingTop:5 ,paddingLeft:10}}
                    defaultValue = {(this.state.HowManyBundleLearn.toString())}
                 />


                
            </View>
            </ScrollView>

            <TouchableNativeFeedback
            onPress={()=>{this.saveItems()}} >
                <View style={{justifyContent:'center',borderTopLeftRadius:0,borderTopRightRadius:0, flexDirection:'row', alignItems:'center', backgroundColor:'rgb(0,122,122)'}}>                
                    <Text style={{color:'white', textAlign:'center', textAlignVertical:'center', margin:10}}>Save Data</Text>
                </View>
            </TouchableNativeFeedback> 

            
                





        
         </View>



                

         
        )
    }
        
    }


}





    