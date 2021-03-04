import React, { Component } from 'react'
import { Form } from 'react-bootstrap';

class ForgotPassword extends Component{
    constructor(){
        super();

        this.state = {
            email: '',
            error: false,
            msgFromServer: '',
            errors: {email: '',  notFound: '', none: ''}
        }
    }

    handleEmailChange = (e) => {
        this.setState({email: e.target.value});
    }

    sendEmail = async(e) => {
        e.preventDefault();
        var tmpErr = {email: '', notFound: '', none: ''};
        if(this.state.email === ''){
            tmpErr["email"] = "Please enter your username or email.";
            this.setState({
                error: false,
                errors: tmpErr,
                msgFromServer: ''
            });
        }   
        else{
            const response = await fetch('http://localhost:5000/forgotPassword',  {
                method: 'POST', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                withCredentials: true,
                body: JSON.stringify({
                    email: this.state.email
                })
            })
            const res = await response.json();

            if(res.data === 'No users registered with that email/username.'){
                tmpErr["notFound"] = "Please enter your username or email.";
                this.setState({
                    error: true,
                    errors: tmpErr,
                    msgFromServer:'No users registered with that email/username.' 
                });
            } else if(res.data === 'Recovery email sent.'){
                tmpErr['email'] = ''; tmpErr['notFound'] = '';
                tmpErr["none"] = "An email has been sent to reset your password!";
                this.setState({
                    error: false,
                    errors: tmpErr,
                    msgFromServer: 'An email has been sent to reset your password!'
                });
            }
        }
    }

    render(){
        const {email, error, msgFromServer} = this.state;
        return(
            <div className="register-body">
                <div className="slider-container" id="slider-container">
                    <div className="form-box">
                        <h2>Reset Password</h2><br/>

                        <Form.Control
                        custom
                        isInvalid={this.state.errors['email'] || this.state.errors['notFound']} 
                        type="email" 
                        placeholder="Email or Username" 
                        value={email}
                            onChange={e => this.setState({email: e.target.value})}
                        /><br/>

                        <Form.Control.Feedback type="invalid">
                            {this.state.errors['email'] && email === ''
                            ? "Please enter your username or email."
                            : null}
                            {this.state.errors['notFound']
                            ? "Email/Username is not recognized. Please try again or register for a new account."
                            : null}
                        </Form.Control.Feedback>      
                        <Form.Control.Feedback type="valid">
                            {this.state.errors['none']
                            ? this.state.errors['none']
                            : null}
                        </Form.Control.Feedback>      
                    
                        <button className="form-button" onClick={e => {
                            this.sendEmail(e)
                        }}>Reset</button>


                    {msgFromServer && !error
                    ? <><p>{msgFromServer}</p>
                        <p>Check your spam folder if you do not see the email.</p>
                        <button className="form-button" onClick={e => {
                            this.props.history.push('/')
                        }}>Home</button>
                        </>
                    : null}

                    </div>
                </div>
            </div>
        );
    }

}

export default ForgotPassword;