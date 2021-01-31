import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import auth from '../components/auth';
import { AlertMsg } from '../components/alerts';

export const Login = props => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    let alert;

    if(!(typeof(props.location.state) !== 'undefined')){
        alert = null;
    }
    // Alert for successful logout
    else if(typeof props.location.state["loggedOut"] !== 'undefined'){
        alert = AlertMsg("success", "You were successfully logged out!");
    }
    // Alert for successful registration
    else if(typeof props.location.state["newlyRegistered"] !== 'undefined'){
        alert = AlertMsg("success", "You were successfully registered!");
    }
    // Check for failed login attempt
    else if(typeof props.location.state["failedAttempt"] !== 'undefined'){
        alert = AlertMsg("error", "Invalid Email or Password!");
    }

    return(
        <div className="login-container">
            <Card style={{width: '35rem'}}>
                <Card.Body>
                    <img className="logostyle" src="/mp-new-logo-beta.png" alt="logo"/>

                    <Card.Title><h1>Login</h1></Card.Title>
                    
                    <div className="alert-container mb-2">
                        {alert}
                    </div>

                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Enter Email" name="email" id="email" onChange={e => setEmail(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <input type="password" className="form-control" placeholder="Enter Password" name="password" id="password" onChange={e => setPassword(e.target.value)}/>
                    </div>

                    <button className="btn btn-success btn-lg btn-block" 
                        onClick={() => { 
                            auth.login(email, password, 
                                (res) => { 
                                    if(typeof res["error"] !== 'undefined'){
                                        props.history.push({
                                            pathname: '/login',
                                            state: {failedAttempt: true}
                                        });
                                    }
                                    else{
                                        res["toggleMap"] = [true, false, false, false];
                                        props.history.push({
                                            pathname: '/dashboard',
                                            state: res
                                        });
                                    }
                                })
                            }
                        }>Login</button>
                </Card.Body>
            </Card>
        </div>
    );
};