
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View,TouchableOpacity,Image,Button } from 'react-native';

import UsersMap from 'src/Component/UsersMap';
import Report from 'src/Component/Report';
import ImagePicker from 'react-native-image-picker';

const options={
    title: 'my pic app',
    takePhotoButtonTitle: 'Take photo with your camera',
    chooseFromLibraryButtonTitle: 'Choose photo from library',
}

export default class ReportScreen extends Component<Props> {

    constructor(props){
        super(props);
        this.state={
            avatarSource: null,
            pic:null
        }
    }

    myfunc=()=>{
        //alert('clicked');

        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          }
          else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }
          else {
            let source = { uri: response.uri };

            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };

            this.setState({
              avatarSource: source
            });
          }
        });
    }


  state ={
    userLocation:null,
    usersPlaces:[],
    topicText:"",
    descText:"",
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
        <View style={styles.container}>
            <Button onPress={()=>
                this.props.navigation.navigate('MainScreen')} 
            title="Back" />
            
            <Report 
                changeTopic={this.setTopic}                  
                changeDescription={this.setDesc} 
                onSendReport={this.sendReportHandler} 
            />

            <Image source={this.state.avatarSource}
            style={{width:'100%',height:300,margin:10}}/>

            <TouchableOpacity style={{backgroundColor:'green',margin:10,padding:10}}
                onPress={this.myfunc}>
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
  container: {
    justifyContent: 'center',
    position: 'absolute', 
    left:0,
    top:0,
    right:0,
    bottom:0,
    backgroundColor: '#ffe79b',
    margin:5
  },
});
