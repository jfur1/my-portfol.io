import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import auth from '../components/auth';
import { AlertMsg } from '../components/alerts';

export const Login = props => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    return(
        <div className="card-container">
            <Card style={{width: '35rem'}}>
                <Card.Body>
                    <img className="logostyle" src="/mp-logo.png" alt="logo"/>

                    <Card.Title><h1>Login</h1></Card.Title>
                    
                    <div className="alert-container mb-2">
                        {AlertMsg("success", "This is an example success flash message!")}
                    </div>

                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Enter Email" name="email" id="email" onChange={e => setEmail(e.target.value)}/>
                    </div>

                    <div className="form-group">
                        <input type="password" className="form-control" placeholder="Enter Password" name="password" id="password" onChange={e => setPassword(e.target.value)}/>
                    </div>

                    <button className="btn btn-danger btn-lg btn-block" onClick={() => { 
                        auth.login(email, password, 
                            () => { 
                                props.history.push("/dashboard");
                            })
                    }
                    }>Login</button>

                </Card.Body>
            </Card>
        </div>
    );
};