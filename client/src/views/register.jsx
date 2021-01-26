import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useToggle } from '../components/useToggle';
import { registerUser } from '../components/registerUser';
import { AlertMsg } from '../components/alerts';

export const Register = props => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [username, setUserName] = useState("");
    const [hidden, toggleHidden] = useToggle();
    
    const [passwordCheck, setPasswordCheck] = useState("");
    const [error, setError] = useState({});

    let alert;
    console.log(props);

    // Null upon first render -- either fail or succeed registration
    // Only defined on this page when registration attempt has failed
    if(props.location.state.emailTaken === true){
        alert = AlertMsg("error", "Email Already Exists!");
    } 
    else if(props.location.state.failedAttempt && props.location.state.errors){
        alert = AlertMsg("warning", props.location.state.errors[0]);
    }
    else{
        console.log("State upon render: ", props.location.state);
        alert = null;
    }


    return(
        <div className="card-container">
            <Card style={{width: '35rem'}}>
                <Card.Body>
                    <img className="logostyle" src="/mp-logo.png" alt="logo"/>
                    <Card.Title><h1>Register</h1></Card.Title>
                    
                    <div className="alert-container mb-2">
                        {alert}
                    </div>

                    <input type="text" className="form-control" placeholder="Enter First Name" name="firstname" id="firstname" onChange={e => setFirstName(e.target.value)}/>

                    <input type="text" className="form-control" placeholder="Enter Last Name" name="lastname" id="lastname" onChange={e => setLastName(e.target.value)}/>

                    <input type="text" className="form-control" placeholder="Enter Email" name="email" id="email" onChange={e => setEmail(e.target.value)}/>

                    <div className="form-group"><input type="text" className="form-control" placeholder="Enter a Username" name="username" id="username" onChange={e => setUserName(e.target.value)}/></div>
                    
                    <div className="form-group">
                        <input type="checkbox" onClick={toggleHidden}/> Show Password
                    </div>

                    <input type={hidden ? 'password' : 'text'} className="form-control" placeholder="Enter Password" name="password" id="password" onChange={e => setPassword(e.target.value)}/>

                    <input type={hidden ? 'password' : 'text'} className="form-control" placeholder="Confirm Password" name="passwordCheck" id="passwordCheck" onChange={e => setPasswordCheck(e.target.value)}/>

                    <button className="btn btn-danger btn-lg btn-block" onClick={() => { 
                        registerUser({firstname, lastname, username, email, password, passwordCheck}, {props},
                            (errors) => { 

                                console.log("State: ", props.location.state);

                                
                                if(!(props.location.state.isRegistered)){
                                    props.history.push({
                                        pathname: '/register',
                                        state: {isRegistered: false, failedAttempt: true, errors: errors}
                                    });
                                } else{
                                    props.history.push({
                                        pathname: '/login',
                                        state: {isRegistered: true, failedAttempt: false, errors: []}
                                    });
                                }
                            });
                        }
                    }>Register</button>

                </Card.Body>
            </Card>
        </div>

    );
};