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
TouchableNativeFeedback} from 'react-native';




export default class Setting extends Component {
    static navigationOptions = {title:'SETTING'}; 
          
    constructor(props){
        super(props)
        this.state={

            username : 'hadi',
                Group_name_Track : 'arman_23_9_96_ble_2',
                    Group_name_Learn : '',
                        ServerAddress : '104.237.255.199:18003',
                            Scan_Interval : 300,
                                Bundle_size : 10,
                                    How_many_bundle_learn : 10,
                                        loading: 1,
           


        }

        
     this.loadData()
     
        
    }



    saveItems = async () => {
        let items= Object.keys(this.state)
        for (var i=0 ; i<4 ; i++){
            try{
                console.log(items[i] + '-->' + Object.values(this.state)[i])                    
                await AsyncStorage.setItem(items[i], (Object.values(this.state)[i]))
            }
            catch(error){console.log('error in Save Items :'+ error)}
}



        for (var i=4 ; i<7 ; i++){
            try{
                if (i==6){
                    console.log(items[i] + '-->' + Object.values(this.state)[i])                    
                    await AsyncStorage.setItem(items[i], (Object.values(this.state)[i]).toString())
                    Alert.alert("Savind done :)")
                }
                else{
                console.log(items[i] + '-->' + Object.values(this.state)[i])                    
                await AsyncStorage.setItem(items[i], (Object.values(this.state)[i]))
                }
                        }
                catch(error){console.log('error in Save Items :'+ error)}
            }


}


    
    loadData = async  () =>{
                try{

                const user =   await AsyncStorage.getItem('username')
                if (user) this.setState({username:user})
    
                const GT =  await AsyncStorage.getItem('Group_name_Track')
                if (GT) this.setState({Group_name_Track:GT})
    
                const GL =  await AsyncStorage.getItem('Group_name_Learn')
                if (GL) this.setState({Group_name_Learn:GL})
    
                const SA =  await AsyncStorage.getItem('ServerAddress')
                if (SA) this.setState({ServerAddress:SA})
    
                const SI =  await AsyncStorage.getItem('Scan_Interval')
                if (SI) this.setState({Scan_Interval:SI})
    
                const BS =  await AsyncStorage.getItem('Bundle_size')
                if (BS) this.setState({Bundle_size:BS})
    
                const HMBL =  await AsyncStorage.getItem('How_many_bundle_learn')
                if (HMBL) this.setState({How_many_bundle_learn:HMBL})
    
                 await this.setState({ loading : 0 })
                
                 
                }catch(error){console.log(error)}


            
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
                <TextInput 
                    underlineColorAndroid='black' 
                    defaultValue = {this.state.username} 
                    style={{ paddingLeft:10}}  
                    onChangeText = { (text)=>{ this.setState({username : text })} }
                />

                <Text> Group_name_Learn </Text>
                <TextInput underlineColorAndroid='black' 
                    onChangeText = { (text)=>{ this.setState({Group_name_Learn : text })} } 
                    style={{ paddingTop:5 ,paddingLeft:10}}
                    defaultValue = {this.state.Group_name_Learn}
                 />

                <Text> Group_name_Track </Text>
                <TextInput underlineColorAndroid='black' 
                    onChangeText = { (text)=>{ this.setState({Group_name_Track : text })} } 
                    style={{ paddingTop:5 ,paddingLeft:10}}
                    defaultValue = {this.state.Group_name_Track}
                 />

                <Text> ServerAddress </Text>
                <TextInput underlineColorAndroid='black' 
                    onChangeText = { (text)=>{ this.setState({ServerAddress : text })} } 
                    style={{ paddingTop:5 ,paddingLeft:10}}
                    defaultValue = {this.state.ServerAddress}
                 />

                <Text> Scan_Interval(ms) </Text>
                <TextInput underlineColorAndroid='black' 
                    onChangeText = { (text)=>{ this.setState({Scan_Interval : text })} } 
                    style={{ paddingTop:5 ,paddingLeft:10}}
                    defaultValue = {(this.state.Scan_Interval.toString())}
                 />

                <Text> Bundle_size </Text>
                <TextInput underlineColorAndroid='black' 
                    onChangeText = { (text)=>{ this.setState({Bundle_size : text })} } 
                    style={{ paddingTop:5 ,paddingLeft:10}}
                    defaultValue = {(this.state.Bundle_size.toString())}
                 />

                <Text> How_many_bundle_learn </Text>
                <TextInput underlineColorAndroid='black' 
                    onChangeText = { (text)=>{ this.setState({How_many_bundle_learn : text })} } 
                    style={{ paddingTop:5 ,paddingLeft:10}}
                    defaultValue = {(this.state.How_many_bundle_learn.toString())}
                 />


                
            </View>

            <TouchableNativeFeedback
            onPress={()=>{this.saveItems()}} >
                <View style={{justifyContent:'center',borderTopLeftRadius:50,borderTopRightRadius:50, flexDirection:'row', alignItems:'center', backgroundColor:'rgb(0,122,122)'}}>                
                    <Text style={{color:'white', textAlign:'center', textAlignVertical:'center', margin:10}}>Save Data</Text>
                </View>
            </TouchableNativeFeedback> 

            </ScrollView>

            
                





        
         </View>



                

         
        )
    }
        
    }


}





    