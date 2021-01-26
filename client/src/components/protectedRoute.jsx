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
                if(auth.isAuthenticated()){
                    return <Component {...props} />;
                }
                else{
                    console.log(props);
                    return <Redirect to={
                        {
                        pathname: '/login',
                        state: {
                            from: props.location,
                            type: "error",
                            msg: "You must be logged in to view this resource!"
                        }
                    }} />    
                }
            }
        }/>
    );
};