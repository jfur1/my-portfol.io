import React from 'react';
import { Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
// import { Welcome } from "./views/welcome";
import UploadProfilePicture from './views/uploadProfilePic'
import Profile from './views/profile';
import {TestRegisterForm} from './components/slider/form';


function App() {
  return (
    <div className="App" style={{backgroundImage: 'url(/geo-bg.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundAttachment: 'fixed', minHeight:'100vh', minWidth: '100vw'}}>
      <Switch>
        <Route exact path="/" component={TestRegisterForm} />
        <Route exact path="/profilepic" component={UploadProfilePicture} />
        <Route exact path="/:username" component={Profile} />
        <Route path="*" component={() => "404 Not Found"} />
      </Switch>
    </div>
  );
}

export default App;