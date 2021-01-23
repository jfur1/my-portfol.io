import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Splash from "./views/splash";
import UsersTable from './views/getData';
import newUser from "./views/register";
import Home from './views/home';
import Login from './views/login';

class App extends Component {
  render() {
    const App = () => (
      <>
        {/* React Switch: Finds the first path to match our current URI and renders associated component */}
        <Switch>
          <Route exact path='/' component={Splash} />
          <Route path='/getData' component={UsersTable} />
          <Route path = '/register' component={newUser} />
          <Route path = '/home' component={Home} />
          <Route path = '/login' component={Login} />
          
          {/* <Route path = '/test' >
            <Redirect to="/register" />
          </Route> */}
          
          {/* Catch-All Method: Undefined Routes Render the Home Componenet */}
          <Route path="*" component={Home} />
        </Switch>
      </>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;