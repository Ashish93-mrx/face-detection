import React, { Component } from 'react';
import Navigation from './component/Navigation/Navigation.js';
import FaceRecognition from './component/FaceRecognition/FaceRecognition.js';
import Logo from './component/Logo/Logo.js';
import ImageLinkForm from './component/ImageLinkForm/ImagLinkFrom.js'
import Rank from './component/Rank/Rank.js';
import SignIn from './component/SignIn/SignIn.js';
import Register from './component/Register/Register.js';
import './App.css';
//import fetch from 'node-fetch';

// const returnClarifaiRequestOptions = (data) => {
//       ///////////////////////////////////////////////////////////////////////////////////////////////////
//     // In this section, we set the user authentication, user and app ID, model details, and the URL
//     // of the image we want as an input. Change these strings to run your own example.
//     //////////////////////////////////////////////////////////////////////////////////////////////////

//     // Your PAT (Personal Access Token) can be found in the portal under Authentification
//     const PAT = '4ecfe0574feb44ffa3ba8488f0b76d3e';
//     // Specify the correct user_id/app_id pairings
//     // Since you're making inferences outside your app's scope
//     const USER_ID = 'oc0g0d3kapls';       
//     const APP_ID = 'test';
//     // Change these to whatever model and image URL you want to use
//     const MODEL_ID = 'face-detection'; 
//     const IMAGE_URL = data;

//     ///////////////////////////////////////////////////////////////////////////////////
//     // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
//     ///////////////////////////////////////////////////////////////////////////////////

//     const raw = JSON.stringify({
//         "user_app_id": {
//             "user_id": USER_ID,
//             "app_id": APP_ID
//         },
//         "inputs": [
//             {
//                 "data": {
//                     "image": {
//                         "url": IMAGE_URL
//                     }
//                 }
//             }
//         ]
//     });

//     const requestOptions = {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Authorization': 'Key ' + PAT
//         },
//         body: raw
//     };

//     return requestOptions;

// }

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
      }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
      }
    }
  }


loaduser= (data) => {
  this.setState({ user: {
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joineds
    }
  })
}

// componentDidMount(){
//   fetch('http://localhost:3000/')
//    .then(response => response.json())
//    .then(console.log);
// }


calculateFaceLocation = (data) => {
  const clarifyFace = data.outputs[0].data.regions[0].region_info.bounding_box;

  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
     leftcol : clarifyFace.left_col * width,
     toprow : clarifyFace.top_row * height,
     rightcol : width - (clarifyFace.right_col * width),
     bottomrow : height - (clarifyFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  console.log(box);
  this.setState({box: box});
}


onInputChange = (event) => {
  this.setState({input: event.target.value})
}

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});

    //fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(this.state.input))
    
        //console.log("check");
        //
        fetch('https://shiv-vfze.onrender.com/imageurl',{
            method:'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
          })
        .then(response => response.json())
        //.then(response => console.log(response))
        .then(response => {
          this.displayFaceBox(this.calculateFaceLocation(response))
          
        if(response){          
          fetch('https://shiv-vfze.onrender.com/image',{
            method:'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
            })
            .catch(err => console.log(err));
          }
        })
      //.then(response => response.json())
      .catch(err => console.log(err));
}    


onRouteChange=(route) => {
  if(route === 'signin'){
   this.setState(initialState);
  } else if(route === 'home'){
    this.setState({isSignedIn: true});
  }
  this.setState({route: route})
}

  render(){
   const { isSignedIn, box, imageUrl, route } = this.state;
  return (
    <div className="App">
      <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
      { route === 'home' 
      ?<div> 
      <Logo />
      <Rank name={this.state.user.name} entries={this.state.user.entries}/>
      <ImageLinkForm 
       onInputChange={this.onInputChange}
       onButtonSubmit={this.onButtonSubmit}
      />
      <FaceRecognition box={box} imageUrl={imageUrl}/> 
      </div>
      :( this.state.route === 'signin'
        ? <SignIn loaduser={this.loaduser} onRouteChange={this.onRouteChange} />
        : <Register loaduser={this.loaduser} onRouteChange={this.onRouteChange} />
      )
      }
    </div>
  );
  }
}

export default App;
