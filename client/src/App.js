import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Home from "./components/home";
import List from './components/getData';
import User from './components/newUser';

class App extends Component {
  render() {
    const App = () => (
      <>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/getData' component={List} />
          <Route path='/newUser' component={User} />
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
