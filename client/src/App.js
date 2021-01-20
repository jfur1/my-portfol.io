import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';

// Components
import List from "./components/test";
import Home from "./components/home";

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/test' component={List}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}


export default App;
