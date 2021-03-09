import { useEffect, useState } from 'react';
import { registerUser } from '../newRegistration/RegisterUser';
import { Alert, Form } from 'react-bootstrap';
import Switch  from '../switch';
import auth from '../auth';
import './form.css';

export const HomeSlider = (props) => {
    console.log("Test Registration Recieved props:", props);

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

    const [errors, setErrors] = useState({            
        fullname: "",
        fullnameLength:"",
        email: "",
        invalidEmail: "",
        password: "",
        passwordLength: "",
        username: "",
        usernameLength:"",
        invalidUsername: "",
        passwordCheck: "",
        noMatch: ""
    });

    const [showAlertRegistered, setShowAlertRegistered] = useState(false);
    const [showAlertLogout, setShowAlertLogout] = useState(false);
    const [showAlertLoginFail, setShowAlertLoginFail] = useState(false);
    const [showAlertNotFound, setShowAlertNotFound] = useState(false);

    useEffect(() => {
        let postData = {};
        if(typeof(props.location.state) !== 'undefined'){
            postData = props.location.state;
            console.log("Recieved POST Response:", postData);
            let tmpErrors = {...postData.errors};
            if(postData.failedAttempt){
                if(postData.emailTaken){
                    tmpErrors["emailTaken"] = "Email already exists!";
                }
                if(postData.usernameTaken){
                    tmpErrors["usernameTaken"] = "Username already exists!";
                }
                setErrors(tmpErrors);
                console.log("Failed to Register. Errors:", tmpErrors);
            } 
            else if(postData.loggedOut){
                setShowAlertLogout(true);
                props.history.push('/');
            }
            else if(postData.loginFailure){
                setShowAlertLoginFail(true);
            }
            else if(postData.errorMsg){
                setShowAlertNotFound(true);
            }
            else{
                clearState();
                setShowAlertRegistered(true);
                document.getElementById('slider-container').classList.remove("sign-up-container-2");

                document.getElementById('slider-container').classList.remove("right-panel-active");
            }
        }
    }, [props])

    const handleEmailChange = (email) => {
        let tmpErrors = {...errors};
        if(errors["emailTaken"] && email !== registerEmail){
            tmpErrors["emailTaken"] = "";
        }
        setErrors(tmpErrors);
        setRegisterEmail(email);
    }

    const handleUsernameChange = (username) => {
        let tmpErrors = {...errors};
        if(errors["usernameTaken"] && username !== registerUsername){
            tmpErrors["usernameTaken"] = "";
        }
        setErrors(tmpErrors);
        setRegisterUserName(username);
    }

    const clearState = () => {
        setRegisterFullName("");
        setRegisterUserName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterPasswordCheck("");
        setErrors({
            fullname: "",
            fullnameLength:"",
            email: "",
            emailTaken: "",
            invalidEmail: "",
            password: "",
            passwordLength: "",
            username: "",
            usernameLength:"",
            usernameTaken: "",
            invalidUsername: "",
            passwordCheck: "",
            noMatch: ""
        });
        setShowAlertRegistered(false);
        setShowAlertLoginFail(false);
    };


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
        clearState();
    }, [])

    
    return(
        <>
        <div className="register-body">
        <img style={{height: "50px", margin: "5%"}} src="/mp-new-logo.png" alt="logo"/>
        <div className="slider-container" id="slider-container">
            <div className="form-container back-btn-container" id="back">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                    </svg>
                </div>
            
            <h1 className="register-title">Register</h1>
            <div className="form-container sign-up-container">
                <div className="form-box">
                    <Form.Control
                        custom
                        isInvalid={errors["fullname"] || errors["fullnameLength"]}
                        type="text"
                        value={registerFullName}
                        placeholder="Full Name" 
                        onChange={e => setRegisterFullName(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors["fullname"] && registerFullName === "" 
                        ? errors["fullname"] : null}
                        {errors["fullnameLength"] ? errors["fullnameLength"] : null }
                    </Form.Control.Feedback>                        
                        <br/>
                    <Form.Control
                        custom
                        type="email" 
                        value={registerEmail}
                        isInvalid={errors["email"] || errors["invalidEmail"] || errors["emailTaken"]}
                        placeholder="Email" 
                        onChange={e => {
                            handleEmailChange(e.target.value);
                        }}/>
                        <Form.Control.Feedback type="invalid">
                        {errors["email"] && registerEmail === ""
                        ? errors["email"] : null}
                        {errors["emailTaken"] ? errors["emailTaken"]: null}
                        {errors["invalidEmail"] ? errors["invalidEmail"] : null}
                        </Form.Control.Feedback>          
                        <br/>
                    <Form.Control
                        custom
                        isInvalid={errors["password"] || errors["passwordLength"]}
                        type={showPassword ? 'text' : 'password'} 
                        value={registerPassword}
                        placeholder="Password"
                        onChange={e => setRegisterPassword(e.target.value)} 
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors["password"] && registerPassword === "" 
                        ? errors["password"] : null}
                        {errors["passwordLength"] ? errors["passwordLength"] : null }
                    </Form.Control.Feedback>                 
                    <br/>
                </div>
            </div>
            <button className="form-button register-btn" id="register">Sign Up</button>

            <div className="form-container sign-up-2">
                <div className="form-box">

                    <label>Select a Username</label>
                    <Form.Control
                        custom
                        isInvalid={errors["username"] || errors["usernameLength"] || errors["invalidUsername"] || errors["usernameTaken"]}
                        type="text" 
                        placeholder="Username" 
                        value={registerUsername}
                        onChange={e => {
                            handleUsernameChange(e.target.value)
                        }}/><br/>
                    <Form.Control.Feedback type="invalid">
                        {errors["username"] && registerUsername === ""
                        ? errors["username"] : null}
                        {errors["usernameTaken"] ? errors["usernameTaken"] : null}
                        {errors["invalidUsername"] ? errors["invalidUsername"]: null}
                        {errors["usernameLength"]  ? errors["usernameLength"] : null}
                    </Form.Control.Feedback>      
                    <Form.Control
                        custom
                        isInvalid={errors["passwordCheck"] || errors["noMatch"]}
                        type={showPassword ? 'text' : 'password'} 
                        value={registerPasswordCheck}
                        placeholder="Confirm Password"
                        onChange={e => setRegisterPasswordCheck(e.target.value)} 
                    />
                    <label>Show Password </label>
                    <Switch
                        type="register"
                        isOn={showPassword}
                        handleToggle={() => setShowPassword(!showPassword)}
                    />
                    <br/>
                    <Form.Control.Feedback type="invalid">
                        {errors["passwordCheck"] && registerPasswordCheck === "" 
                        ? errors["passwordCheck"] : null}
                        {errors["noMatch"] ? errors["noMatch"] : null }
                    </Form.Control.Feedback>         
                    <button className="form-button finish" id="register2"
                        onClick={() => {
                            const credentials = {
                                fullname: registerFullName,
                                email: registerEmail,
                                username: registerUsername,
                                password: registerPassword,
                                passwordCheck: registerPasswordCheck
                            };
                            registerUser(credentials, (res) => { 
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
                    {showAlertRegistered
                    ? <Alert variant="success" onClose={() => setShowAlertRegistered(false)} dismissible>You were successfully registered!</Alert>
                    : null}

                    {showAlertLogout
                    ? <Alert variant="success" onClose={() => setShowAlertLogout(false)} dismissible>You successfully logged out!</Alert>
                    : null}

                    {showAlertLoginFail
                    ? <Alert variant="danger" onClose={() => setShowAlertLoginFail(false)} dismissible>Invlaid email or password!</Alert>
                    : null}
                    
                    {showAlertNotFound
                    ? <Alert variant="danger" onClose={() => setShowAlertNotFound(false)} dismissible>{props.location.state.errorMsg}</Alert>
                    : null}

                    <h1>Sign in</h1><br/>

                    <input type="email" placeholder="Email or Username" 
                        onChange={e => setLoginEmail(e.target.value)}
                    /><br/>
                    <input type="password" placeholder="Password" 
                        onChange={e => setLoginPassword(e.target.value)}
                    /><br/>
                    {/* eslint-disable-next-line} */}
                    <a href="/forgot">Forgot your password?</a>
                    <button className="form-button" 
                        onClick={() => {
                            auth.login(loginEmail, loginPassword, 
                                (res) => { 
                                    if(typeof res["error"] !== 'undefined'){
                                        props.history.push({
                                            pathname: '/',
                                            state: {loginFailure: true}
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
    </>
    )
}
