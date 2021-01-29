import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from '../components/auth';

// Custom Authentication Middleware Component
export const ProtectedRoute = ({
    component: Component, 
    ...rest
}) => {
    return (
        <Route 
            {...rest} 
            render={ (props) => {

                if(auth.isAuthenticated() || props.location.state){
                    return <Component {...props}/>;
                }
                else{
                    return <Redirect to={
                        {
                        pathname: '/login',
                        state: props.history.state   
                    }} />    
                }
            }
        }/>
    );
};