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
                    
                    <div className="form-container back-btn-container mx-4 my-4" id="back">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#06D6A0" className="bi bi-arrow-left-circle" viewBox="0 0 16 16" 
                    onClick={() => {this.props.history.push('/')}}>
                            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                        </svg>
                    </div>
            
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