import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useToggle } from '../components/useToggle';
import { registerUser } from '../components/registerUser';

export const Register = props => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [username, setUserName] = useState("");
    const [hidden, toggleHidden] = useToggle();
    
    const [passwordCheck, setPasswordCheck] = useState("");
    const [error, setError] = useState({});

    return(
        <div className="card-container">
            <Card style={{width: '35rem'}}>
                <Card.Body>
                    <img className="logostyle" src="/mp-logo.png" alt="logo"/>

                    <Card.Title><h1>Register</h1></Card.Title>
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
                        registerUser({firstname, lastname, username, email, password}, 
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