import React, { Component } from 'react'

class ForgotPassword extends Component{
    constructor(){
        super();

        this.state = {
            email: '',
            error: false,
            msgFromServer: ''
        }
    }

    handleEmailChange = (e) => {
        this.setState({email: e.target.value});
    }

    sendEmail = async(e) => {
        e.preventDefault();
        if(this.state.email === ''){
            this.setState({
                error: false,
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
                this.setState({
                    error: true,
                    msgFromServer:'No users registered with that email/username.' 
                });
            } else if(res.data === 'Recovery email sent.'){
                this.setState({
                    error: false,
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

                        <input type="email" placeholder="Email or Username" value={email}
                            onChange={e => this.setState({email: e.target.value})}
                        /><br/>

                        <button className="form-button" onClick={e => {
                            this.sendEmail(e)
                        }}>Reset</button>
                    

                    {error && email !== ''
                    ? <p>Email/Username is not recognized. Please try again or register for a new account.</p>
                    : null}

                    {msgFromServer && !error
                    ? <><p>{msgFromServer}</p>
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