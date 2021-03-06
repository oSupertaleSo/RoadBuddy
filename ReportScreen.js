import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity,Image,Button,TextInput,Picker} from 'react-native';

import UsersMap from 'src/Component/UsersMap';
import Report from 'src/Component/Report';
import ImagePicker from 'src/Component/ImagePicker';

export default class ReportScreen extends Component {

  state ={
    userLocation:null,
    usersPlaces:[],
    topicText:"",
    descText:"",
    reportType: ""
  }
  componentDidMount(){
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        userLocation:{
          latitude:position.coords.latitude,
          longitude:position.coords.longitude,
          latitudeDelta: 0.0010,
          longitudeDelta: 0.0010,
        }
      });
      
    }, err => console.log(err));

  }
  
  sendReportHandler=()=>{
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          userLocation:{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude,
            latitudeDelta: 0.0010,
            longitudeDelta: 0.0010,
          }
        });
        fetch('https://test-2e10e.firebaseio.com/places.json',{
          method: 'POST',
          body: JSON.stringify({
            latitude:position.coords.latitude,
            longitude:position.coords.longitude, 
            topic: this.state.topicText,
            description:this.state.descText
          })
        })
        alert("Send Success!");
        this.setTopic("");
        this.props.navigation.navigate('MainScreen') ;
      },
      err => console.log(err)
    );
  };

  setTopic=(text)=>{
    this.setState({topicText:text})
  }
  setDesc=(text)=>{
    this.setState({descText:text})
  }

  setReportType = (reportType) => {
    this.setState({ reportType: reportType })
 }
  
  getUserPlacesHandler=()=>{
    fetch('https://test-2e10e.firebaseio.com/places.json')
      .then(res => res.json())
      .then(parsedRes => {
        const placesArray=[];
        for(const key in parsedRes){
          placesArray.push({
            latitude: parsedRes[key].latitude,
            longitude: parsedRes[key].longitude,
            id: key,
            topic: parsedRes[key].topic
          });
        }
        this.setState({
          usersPlaces: placesArray
        });
      })
  };

  render() {
    return (
        <View style={styles.imgContainer}>
            
            <Report 
                changeTopic={this.setTopic}                  
                changeDescription={this.setDesc} 
                changeReportType={this.setReportType}
                onSendReport={this.sendReportHandler} 
            />

            <Image source={this.state.avatarSource}
            style={{width:'100%',height:300,margin:10}}/>

            <TouchableOpacity style={{backgroundColor:'green',margin:10,padding:10}}
            nPress={this.onPress}>
            <Text style={{color:'#fff'}}>Select Image</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.uploadPic}>
            <Text>Upload</Text>
            </TouchableOpacity>

            <UsersMap 
                userLocation={this.state.userLocation} 
                usersPlaces={this.state.usersPlaces} 
            />
        </View> 
    )
  }
}
const styles = StyleSheet.create({
  /*container: {
    justifyContent: 'center',
    position: 'absolute', 
    left:0,
    top:0,
    right:0,
    bottom:0,
    backgroundColor: '#ffe79b',
    margin:5
  },*/
  imgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});