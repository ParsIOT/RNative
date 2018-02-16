'use strict';
import React, {Component} from 'react';
import { StyleSheet,Text,
ListView,View, DeviceEventEmitter,
Alert, PermissionsAndroid, WebView,
Button,
TextInput,
ScrollView} from 'react-native';




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
            D_username : '',
                D_Group_name_Track : '',
                    D_Group_name_Learn : '',
                        D_ServerAddress : '',
                            D_Scan_Interval : null,
                                D_Bundle_size : null,
                                    D_How_many_bundle_learn : null


        }
        
        
    }

    render(){
        return(
            <ScrollView>  
            <View style={{flex:1}}>


 
                <Text style={{paddingBottom:10, paddingTop:10}}> SERVER SETTING </Text>

                <Text> username </Text>
                <TextInput underlineColorAndroid='black' value = { this.state.username } style={{ paddingLeft:10}} onChangeText={(text)=>{this.setState({usename:text})}}/>

                <Text> Group_name_Learn </Text>
                <TextInput underlineColorAndroid='black' value = { this.state.Group_name_Learn } onChange = { (text)=>{ this.setState({Group_name_Learn : text })} } style={{ paddingTop:5 ,paddingLeft:10}}/>

                <Text> Group_name_Track </Text>
                <TextInput underlineColorAndroid='black' value = { this.state.Group_name_Track } onChange = { (text)=>{ this.setState({Group_name_Track : text })} } style={{ paddingTop:5 ,paddingLeft:10}}/>

                <Text> ServerAddress </Text>
                <TextInput underlineColorAndroid='black' value = { this.state.ServerAddress } onChange = { (text)=>{ this.setState({ ServerAddress: text })} } style={{ paddingTop:5 ,paddingLeft:10}}/>


                <Text> Scan_Interval </Text>
                <TextInput underlineColorAndroid='black' value = { (this.state.Scan_Interval).toString() }  onChange = { (text)=>{ this.setState({Scan_Interval : text })} } style={{ paddingTop:5 ,paddingLeft:10}}/>

                <Text> Bundle_size </Text>
                <TextInput underlineColorAndroid='black' value = { (this.state.Bundle_size).toString() } onChange = { (text)=>{ this.setState({Bundle_size : text })} } style={{ paddingTop:5 ,paddingLeft:10}}/>

                <Text> How_many_bundle_learn </Text>
                <TextInput underlineColorAndroid='black' value = { (this.state.How_many_bundle_learn).toString() } onChange = { (text)=>{ this.setState({How_many_bundle_learn : text })} } style={{ paddingTop:5 ,paddingLeft:10}}/>


                <Button title='save' style={{marginBottom:50}} onPress={()=>{this.setState({

                    D_username:this.state.username,
                    D_Group_name_Learn: this.state.Group_name_Track,
                    D_Group_name_Track : this.state.Group_name_Track,
                    D_Scan_Interval : this.state.Scan_Interval,
                    D_Bundle_size : this.state.Bundle_size,
                    D_ServerAddress : this.state.Bundle_size,
                    D_How_many_bundle_learn : this.state.How_many_bundle_learn

                    

                })}}/>
            </View> 

            </ScrollView>

                

         
        )
        
    }


}





    