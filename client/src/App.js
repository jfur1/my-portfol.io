import React from 'react';
import { Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import { Welcome } from "./views/welcome";
import Profile from './views/profile';
import { Login } from './views/login';
import { Register } from './views/register';



function App() {
  return (
    <div className="App" style={{backgroundImage: 'url("/geo-bg.png")', backgroundSize: 'cover', height: '100vh'}}>
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/:username" component={Profile} />
        <Route path="*" component={() => "404 Not Found"} />
      </Switch>
    </div>
  );
}

export default App;