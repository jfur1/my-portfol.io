import { useEffect, useState } from 'react';
import { AlertMsg } from '../alerts';
import { Form } from 'react-bootstrap';
import Switch  from '../switch';
import auth from '../auth';
import './form.css';

export const TestRegisterForm = (props) => {
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
    const [errors1, setErrors1] = useState({});
    const [errors2, setErrors2] = useState({});
    const [validated1, setValidated1] = useState(false);
    const [validated2, setValidated2] = useState(false);

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

    const handleRegisterSubmit1 = () => {
        let isValidated = true;
        let errors = {};

        if (registerFullName === "") {
            errors["fullname"] = "Please enter your full name.";
            isValidated = false;
            setValidated1(false);
        }
        if (registerEmail === "") {
            errors["email"] = "Please enter an email address.";
        }
        if (registerEmail !== '') {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(registerEmail)) {
                errors["invalidEmail"] = "Please enter a valid email address.";
                isValidated = false;
                setValidated1(false);
            }
        }
        if (registerPassword === "") {
            errors["password"] = "Please enter a password.";
            isValidated = false;
            setValidated1(false);
        } else if(registerPassword.length < 7){
            errors["passwordLength"] = "Password must be at least 8 characters.";
            isValidated = false;
            setValidated1(false);
        } else if(registerPassword.length > 19){
            errors["passwordLength"] = "Password must be less than 20 characters.";
            isValidated = false;
            setValidated1(false);
        }


        setValidated1(isValidated);
        setErrors1(errors);
        return isValidated;
    }
    
    const handleRegisterSubmit2 = () => {
        let isValidated = true;
        let errors = {};

        if(registerUsername === ""){
            errors["username"] = "Please enter a username.";
            isValidated = false;
            setValidated1(false);
        }
        if(registerPasswordCheck === ""){
            errors["passwordCheck"] = "Please confirm your password.";
            isValidated = false;
            setValidated1(false);
        }
        else if(registerPasswordCheck !== registerPassword){
            errors["noMatch"] = "Passwords do not match!";
            isValidated = false;
            setValidated1(false);
        }

        setValidated2(isValidated);
        setErrors2(errors);
        return isValidated;
    }


    useEffect(() => {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const register = document.getElementById('register');
        const backBtn = document.getElementById('back');
        const container = document.getElementById('slider-container');

        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
            setErrors1({});
            setErrors2({});
        });
        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });
        // register.addEventListener('click', (e) => {
            // if(!handleRegisterSubmit1()){
            //     e.preventDefault();
            //     e.stopPropagation();
            // } else {
        //         container.classList.add("sign-up-container-2");
        //         if( !handleRegisterSubmit2()){
        //             console.log("BOTH FORMS VALID!!");
        //             e.preventDefault();
        //         }
        //     }
        // })

        backBtn.addEventListener('click', () => {
            container.classList.remove("sign-up-container-2");
            setShowPassword(false);
        })
        setErrors1({});
        setErrors2({});
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
            <Form noValidate validated={validated1} id="form1" >
            <div className="form-container sign-up-container">
                <div className="form-box">
                    <Form.Control
                        custom
                        required
                        isInvalid={typeof(errors1["fullname"]) !== 'undefined' && registerFullName === ""}
                        type="text" 
                        placeholder="Full Name" 
                        onChange={e => setRegisterFullName(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">{errors1["fullname"]}</Form.Control.Feedback>
                    <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                        
                        <br/>
                    <Form.Control 
                        custom
                        required
                        isInvalid={typeof(errors1["email"]) !== 'undefined' || typeof(errors1["invalidEmail"]) !== 'undefined' || typeof(errors1["emailTaken"]) !== 'undefined'}
                        type="email" 
                        placeholder="Email" 
                        onChange={e => {
                            if(typeof(errors1["emailTaken"]) !== 'undefined' && e.target.value !== ''){
                                delete errors1["emailTaken"];
                            }
                            setRegisterEmail(e.target.value);
                        }}/>
                    <Form.Control.Feedback type="invalid">
                        {typeof(errors1["email"]) !== 'undefined' && registerEmail === ""
                            ? errors1["email"]
                            : null}
                        {typeof(errors1["emailTaken"]) !== 'undefined'
                            ? errors1["emailTaken"]
                            : null}
                        {typeof(errors1["invalidEmail"]) !== 'undefined' && registerEmail !== ""
                        ? errors1["invalidEmail"]
                        : null}
                        </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                        <br/>
                    <label>Show Password </label>
                    <Switch
                        type="register"
                        isOn={showPassword}
                        handleToggle={() => setShowPassword(!showPassword)}
                    />
                    <Form.Control 
                        custom
                        required 
                        isInvalid={typeof(errors1["password"]) !== 'undefined' || typeof(errors1["passwordLength"]) !== 'undefined'}
                        type={showPassword ? 'text' : 'password'} placeholder="Password"
                        onChange={e => setRegisterPassword(e.target.value)} 
                    />
                    <Form.Text id="passwordHelpInline" muted>
                        Must be 8-20 characters long.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                    {typeof(errors1["password"]) !== 'undefined' && registerPassword === ""
                    ? errors1["password"] : null}
                    {typeof(errors1["passwordLength"]) !== 'undefined'
                    ? errors1["passwordLength"] : null}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                    <br/>
                </div>
            </div>
            <button type="submit" className="form-button register-btn" id="register"
                onClick={e => {
                    if(!handleRegisterSubmit1()){
                        e.preventDefault();
                        e.stopPropagation();
                    } else{
                        document.getElementById('slider-container').classList.add("sign-up-container-2");
                        e.preventDefault();
                    }
                }}
            >Sign Up</button>
            </Form>

            <Form noValidate validated={validated2} id="form2" onSubmit={e => {
                if(!handleRegisterSubmit1() || !handleRegisterSubmit2()){
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("errors1:", errors1);
                    console.log("errors2:", errors2);
                } else{
                    console.log("VALIDATED FORM 2!!")
                    const credentials = {
                        fullname: registerFullName,
                        email: registerEmail,
                        username: registerUsername,
                        password: registerPassword
                    }
                    console.log("Credentials:", credentials);
                    fetch('http://localhost:5000/newUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(credentials),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Response:', data);
                        if(typeof(data["emailTaken"]) !== "undefined"){
                            console.log("That email is already registered to an account!");
                            setErrors1({emailTaken : "Email is already registered to an account!"})
                        }if(typeof(data["usernameTaken"]) !== "undefined"){
                            console.log("Username taken!");
                            setErrors2({usernameTaken : "Username already taken!"})
                        }
                    });
                    e.preventDefault();
                }
            }}>
            <div className="form-container sign-up-2">
                <div className="form-box">

                    <label>Select a Username</label>
                    <Form.Control 
                        custom
                        required 
                        isInvalid={(typeof(errors2["username"]) !== 'undefined' && registerUsername === "") || typeof(errors2["usernameTaken"]) !== 'undefined'}
                        type="text" 
                        placeholder="Username" 
                        onChange={e => {
                            if(typeof(errors2["usernameTaken"]) !== 'undefined' && e.target.value !== ""){
                                delete errors2["usernameTaken"];
                            }
                            setRegisterUserName(e.target.value)
                        }}/><br></br>
                        <Form.Control.Feedback type="invalid">
                        {typeof(errors2["username"]) !== 'undefined' && registerUsername === ""
                        ? errors2["username"] : null}
                        {typeof(errors2["usernameTaken"]) !== 'undefined'
                        ? errors2["usernameTaken"] : null}
                        </Form.Control.Feedback>
                    <Form.Control 
                        custom
                        required 
                        isInvalid={typeof(errors2["passwordCheck"]) !== 'undefined' || typeof(errors2["noMatch"]) !== 'undefined'}
                        type={showPassword ? 'text' : 'password'} placeholder="Confirm Password"
                        onChange={e => setRegisterPasswordCheck(e.target.value)} />
                    <Form.Control.Feedback type="invalid">
                        {typeof(errors2["passwordCheck"]) !== 'undefined' && registerPasswordCheck === ""
                        ? errors2["passwordCheck"] : null}
                        {typeof(errors2["noMatch"]) !== 'undefined'
                        ? errors2["noMatch"] : null}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                    
                    <button type="submit" className="form-button finish" id="register2">Finish</button>
                </div>
            </div>
            
            </Form>
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
