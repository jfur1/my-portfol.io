import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Home from "./components/home";
import List from './components/getData';

class App extends Component {
  render() {
    const App = () => (
      <>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/getData' component={List} />
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
