import { useEffect, useState } from 'react';
import { AlertMsg } from '../alerts';
import auth from '../auth';
import './form.css';

export const TestRegisterForm = (props) => {
    const [loginEmail, setLoginEmail] = useState();
    const [loginPassword, setLoginPassword] = useState();

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
    useEffect(() => {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('slider-container');

        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });
        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });
    }, [])
    
    return(
        <>
        <div className="register-body">
        <div className="slider-container" id="slider-container">
            <div className="form-container sign-up-container">
                <div className="form-box">
                    <h1>Register</h1><br/>

                    <input type="text" placeholder="Firstname" /><br/>
                    <input type="text" placeholder="Lastname" /><br/>
                    <input type="email" placeholder="Email" /><br/>
                    <input type="password" placeholder="Password" />
                    <button className="form-button">Sign Up</button>
                </div>
            </div>
            <div className="form-container sign-in-container">
                <div className="form-box">
                    {/* <div className="alert-container mb-2">
                        {alert}
                    </div> */}
                    <h1>Sign in</h1><br/>

                    <input type="email" placeholder="Email" 
                        onChange={e => setLoginEmail(e.target.value)}
                    /><br/>
                    <input type="password" placeholder="Password" 
                        onChange={e => setLoginPassword(e.target.value)}
                    /><br/>
                    {/* eslint-disable-next-line} */}
                    <a href="#">Forgot your password?</a>
                    <button className="form-button" 
                        onClick={() => {
                            auth.login(loginEmail, loginPassword, 
                                (res) => { 
                                    if(typeof res["error"] !== 'undefined'){
                                        props.history.push({
                                            pathname: '/testRegister',
                                            state: {failedAttempt: true}
                                        });
                                    }
                                    else{
                                        res["ownedByUser"] = true;
                                        props.history.push({
                                            pathname: `/${res.username}`,
                                            state: {
                                                user: res,
                                                requestedBy: res
                                            }
                                        });
                                    }
                                })
                            }
                    }>Sign In</button>
                </div>
            </div>
            
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Welcome Back!</h1>
                        <p className="overlay-description">
                            Already a member?<br/>
                            Sign in now!
                        </p>
                        <button className="ghost" id="signIn">Sign In</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Hello, Friend!</h1>
                        <p className="overlay-description">
                            Not a member yet?<br/>
                            Sign up for free today!
                        </p>
                        <button className="ghost" id="signUp">Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <footer>
            my-portfol.io (2020). All Rights Reserved.
        </footer>
    </>
    )
}
