import React from 'react';
import { Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
// import { Welcome } from "./views/welcome";
import ForgotPassword from './views/ForgotPassword'
import Profile from './views/profile';
import {HomeSlider} from './components/slider/form';
import ResetPassword from './views/ResetPassword';
import { Footer } from './views/Footer'

function App() {
  return (
    <>
    <div className="App" 
      style={{
        backgroundImage: 'url(/geo-bg.png)', 
        backgroundRepeat: 'no-repeat',
         backgroundSize: 'cover', 
         backgroundAttachment: 'fixed',
         minHeight:'100vh',
         paddingBottom: '140px'
      }}>
      <Switch>
        <Route exact path="/" component={HomeSlider} />
        <Route exact path="/forgot" component={ForgotPassword} />
        <Route exact path="/reset/:token" component={ResetPassword} />
        <Route exact path="/:username" component={Profile} />
        <Route path="*" component={() => "404 Not Found"} />
      </Switch>
    </div>
    <Footer/></>
  );
}

export default App;