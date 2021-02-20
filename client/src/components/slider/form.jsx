import { useEffect, useState } from 'react';
import { registerUser } from '../newRegistration/RegisterUser';
import { AlertMsg } from '../alerts';
import Switch  from '../switch';
import auth from '../auth';
import './form.css';

export const TestRegisterForm = (props) => {
    console.log("Test Registration Recieved props:", props);

    let postData = {};
    let alert;

    useEffect(() => {
        if(typeof(props.location.state) !== 'undefined'){
            postData = props.location.state;
            console.log("Post Data on Rerender:", postData);
            if(!postData.failedAttempt){
                clearState();
                document.getElementById('slider-container').classList.remove("sign-up-container-2");

                document.getElementById('slider-container').
                classList.remove("right-panel-active");

                alert = AlertMsg("success", "You were successfully registered!");

            }
        }
    }, [props])

    const clearState = () => {
        setRegisterFullName("");
        setRegisterUserName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterPasswordCheck("");
    };

    // Login Hooks
    const [loginEmail, setLoginEmail] = useState();
    const [loginPassword, setLoginPassword] = useState();
    // Registration Hooks
    const [registerFullName, setRegisterFullName] = useState("");
    const [registerUsername, setRegisterUserName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerPasswordCheck, setRegisterPasswordCheck] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    // Only runs once (acts like componentDidMount)
    useEffect(() => {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const register = document.getElementById('register');
        const backBtn = document.getElementById('back');
        const container = document.getElementById('slider-container');

        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });
        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });
        register.addEventListener('click', () => {
            container.classList.add("sign-up-container-2");
        })
        backBtn.addEventListener('click', () => {
            container.classList.remove("sign-up-container-2");
            setShowPassword(false);
        })
    }, [])

    
    return(
        <>
        <div className="register-body">
        <div className="slider-container" id="slider-container">
            <div className="form-container back-btn-container" id="back">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                    </svg>
                </div>
            
            <h1 className="register-title">Register</h1>
            <div className="form-container sign-up-container">
                <div className="form-box">
                    <input
                        type="text"
                        value={registerFullName}
                        placeholder="Full Name" 
                        onChange={e => setRegisterFullName(e.target.value)}
                    />                        
                        <br/>
                    <input
                        type="email" 
                        value={registerEmail}
                        placeholder="Email" 
                        onChange={e => {
                            setRegisterEmail(e.target.value);
                        }}/>
                        <br/>
                    <input
                        type={showPassword ? 'text' : 'password'} 
                        value={registerPassword}
                        placeholder="Password"
                        onChange={e => setRegisterPassword(e.target.value)} 
                    />
                    <br/>
                </div>
            </div>
            <button className="form-button register-btn" id="register">Sign Up</button>

            <div className="form-container sign-up-2">
                <div className="form-box">

                    <label>Select a Username</label>
                    <input
                        type="text" 
                        placeholder="Username" 
                        value={registerUsername}
                        onChange={e => {
                            setRegisterUserName(e.target.value)
                        }}/><br/>
                    <label>Show Password </label>
                    <Switch
                        type="register"
                        isOn={showPassword}
                        handleToggle={() => setShowPassword(!showPassword)}
                    />
                    <input
                        type={showPassword ? 'text' : 'password'} 
                        value={registerPasswordCheck}
                        placeholder="Confirm Password"
                        onChange={e => setRegisterPasswordCheck(e.target.value)} /><br/>
                    
                    <button className="form-button finish" id="register2"
                        onClick={() => {
                            const credentials = {
                                fullname: registerFullName,
                                email: registerEmail,
                                username: registerUsername,
                                password: registerPassword,
                                passwordCheck: registerPasswordCheck
                            }
                            registerUser(credentials, (res) => { 
                                console.log("Recieved POST Response:", res);
                                // Invalid Request
                                if(res.failedAttempt){
                                    props.history.push({
                                        pathname: '/',
                                        state: res
                                    });
                                // Successful Registration
                                } else{
                                    props.history.push({
                                        pathname: '/',
                                        state: {failedAttempt: false, newlyRegistered: true}
                                    });
                                }
                            })
                        }}
                    >Finish</button>
                </div>
            </div>
            
            <div className="form-container sign-in-container">
                <div className="form-box">
                    <div className="alert-container mb-2">
                        {alert}
                    </div>
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
