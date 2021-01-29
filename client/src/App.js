import React from 'react';
import { Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import { Welcome } from "./views/welcome";
import { Dashboard } from './oldCode/dashboard';
import { ProtectedRoute } from './components/protectedRoute';
import { Login } from './views/login';
import { Register } from './views/register';

import { Profile } from './views/profile';
import  UsersTable  from  './oldCode/getData';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <ProtectedRoute exact path="/dashboard" component={Profile} />
        <ProtectedRoute exact path="/getData" component={UsersTable} />
        <Route path="*" component={() => "404 Not Found"} />
      </Switch>
    </div>
  );
}

export default App;

/* <Route> and <ProtectedRoute> pass a 'history' attribute onto props * NOTE: Will not work with react Components!! */