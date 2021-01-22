import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Splash from "./components/splash";
import UsersTable from './components/getData';
import newUser from "./components/register";
import Home from './components/home';
import Login from './components/login';

class App extends Component {
  render() {
    const App = () => (
      <>
        <Switch>
          <Route exact path='/' component={Splash} />
          <Route path='/getData' component={UsersTable} />
          <Route path = '/register' component={newUser} />
          <Route path = '/home' component={Home} />
          <Route path = '/login' component={Login} />
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