import * as ACTIONS from './actions';
import { Auth } from './components/auth';
import * as AuthReducer from './auth_reducer';
import React, { useReducer } from 'react';
import Context from './context';

const auth = new Auth();

const ContextState = () => {

    const [stateAuthReducer, dispatchAuthReducer] = useReducer(AuthReducer.AuthReducer, AuthReducer.initialState)

    return(
        <div>
        <Context.Provider
            value={{
  
              //Auth Reducer
              authState: stateAuthReducer.is_authenticated,
              profileState:  stateAuthReducer.profile,
              handleUserLogin: () => handleLogin(),
              handleUserLogout: () => handleLogout(),
              handleUserAddProfile: (profile) => handleAddProfile(profile),
              handleUserRemoveProfile: () => handleRemoveProfile(),
  
              //Handle auth
              handleAuth: (props) => handleAuthentication(props),
              authObj: auth
            }}>
            <Routes />
        </Context.Provider>
        </div>
      )

}

export default ContextState;