import React, { useState, useMemo } from 'react';
import { Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import { Welcome } from "./views/welcome";
import  { Profile }  from './views/profile';
import { ProtectedRoute } from './components/protectedRoute';
import { Login } from './views/login';
import { Register } from './views/register';

import  UsersTable  from  './oldCode/getData';
import { UserContext, AuthContext } from './components/utils/context';

function App() {
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState(null);
  // Prevents value from changing unless value/setValue changes
  const providerValue = useMemo(() => ({user, setUser}), [user, setUser]);
  const value = useMemo(() => ({authState, setAuthState}), [authState, setAuthState]);

  return (
    <div className="App" style={{backgroundImage: 'url("/geo-bg.png")', backgroundSize: 'cover', backgroundAttachment: 'scroll', height: '100vh'}}>

      <AuthContext.Provider value={value}>
      <UserContext.Provider value={providerValue}>
      <Switch> 
        <Route exact path="/" component={Welcome} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/:username" component={Profile} />
        <ProtectedRoute exact path="/getData" component={UsersTable} />
        <Route path="*" component={() => "404 Not Found"} />
      </Switch>
      </UserContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;