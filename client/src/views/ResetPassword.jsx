import React, {Component} from 'react'

export default class ResetPassword extends Component{
    constructor(){
        super();
        
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            updated: false,
            error: false
        }
    }

    async componentDidMount(){
        console.log(this.props.match.params.token)
        const response = await fetch(`http://localhost:5000/reset/${this.props.match.params.token}`, {
            method: 'GET', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
        })
        const res = await response.json();

        if(!res.authenticated){
            this.setState({
                error: true,
                updated: false
            })
        }
        else{
            console.log("Authenticated! Response: ", res);
            this.setState({
                updated: false,
                email: res.email,

            })
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    updatePassword = async(e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/reset/${this.props.match.params.token}`, {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
        const res = await response.json();
        if(res.updated){
            this.setState({
                email: res.email,
                updated: true,
                error: false
            });
        } else{
            this.setState({
                updated: false,
                error: true
            });
        }
    }

    validatePasswords = (e) => {
        const {password, confirmPassword} = this.state;
        e.preventDefault();
        
        if(!password){
            
        } else if(password.length < 7 || password.length > 19){

        }

        if(!confirmPassword){

        } else if(confirmPassword.length < 7 || confirmPassword.length > 19){

        }

        if(password !== confirmPassword){

        }
    }

    render(){
        const {password, confirmPassword, error, updated} = this.state;

        if(error){
            return(
                <div className="register-body">
                    <div className="slider-container" id="slider-container">
                        <div className="form-box">
                            <h4>Error resetting password. Please send another reset link.</h4>
                        </div>
                    </div>
                </div>
            );
        } else{
            return(
                <div className="register-body">
                    <div className="slider-container" id="slider-container">
                        <div className="form-box">
                            <h4>Reset Password</h4>
                            <input type="password" placeholder="New Password" value={password}
                            onChange={e => 
                                this.setState({password: e.target.value})
                            }/><br/>
                            <input type="password" placeholder="Confirm Password" value={confirmPassword}
                            onChange={e => 
                                this.setState({confirmPassword: e.target.value})
                            }/><br/>

                            <button className="form-button" onClick={e => {
                                this.updatePassword(e)
                            }}>Reset</button>

                            {updated
                            ? <p>Your password has been successfully reset, please try logging in again.</p>
                            : null}
                        </div>
                    </div>
                </div>
            );
        }
    }

}