import React, { useEffect, useState } from 'react';
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
    const [count, setCount] = useState(0);
    const [hidden, toggleHidden] = useToggle();
    const [passwordCheck, setPasswordCheck] = useState("");
    

    useEffect(() => {
        console.log("Render Count = ", count);
    })

    let alert;

    if(count === 0){
        alert = null;
    }
    else if(props.location.state["data"].failedAttempt && props.location.state["errors"]){
        alert = AlertMsg("warning", props.location.state["errors"][0]);
        props.location.state["errors"].pop();
    }
    else{
        console.log("State upon render: ", props.location.state);
        alert = null;
    }


    return(
        <div className="register-container">
            <Card style={{width: '35rem'}}>
                <Card.Body>
                    <img className="logostyle" src="/mp-new-logo.png" alt="logo"/>
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

                    <button className="btn btn-success btn-lg btn-block" onClick={() => { 
                        registerUser({firstname, lastname, username, email, password, passwordCheck}, {props},
                            (res) => { 
                                setCount(count + 1);
                                console.log("State: ", props.location.state);
                                console.log("Client Recieved Response: ", res);
                                
                                if(res["errors"].length > 0){
                                    props.history.push({
                                        pathname: '/register',
                                        state: {data: res["data"],  errors: res["errors"]}
                                    });
                                } else{
                                    props.history.push({
                                        pathname: '/login',
                                        state: {newlyRegistered: true}
                                    });
                                }
                            }   
                        );
                    }}>Register</button>

                </Card.Body>
            </Card>
        </div>

    );
};