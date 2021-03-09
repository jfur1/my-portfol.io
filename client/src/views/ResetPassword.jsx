import React, {Component} from 'react'
import { Form } from 'react-bootstrap';

export default class ResetPassword extends Component{
    constructor(){
        super();
        
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            updated: false,
            error: false,
            errors: {null: '', noMatch: '', length: ''}
        }
    }

    async componentDidMount(){
        console.log(this.props.match.params.token)
        const response = await fetch(`/resetPassword/${this.props.match.params.token}`, {
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

    length(obj) {
        if((!(typeof(obj) !== 'undefined')) || (obj == null)) return 0;
        return Object.keys(obj).length;
    }

    updatePassword = async(e) => {
        const tmpErrs = this.validatePasswords();
        console.log(tmpErrs)
        if(tmpErrs['null'] || tmpErrs['noMatch'] || tmpErrs['length']){
            this.setState({errors: tmpErrs});
        }
        else{
            this.setState({errors: {null: '', noMatch: '', length: ''}})
            const response = await fetch(`/reset/${this.props.match.params.token}`, {
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
    }

    validatePasswords = () => {
        const errors = {null: '', noMatch: '', length: ''}
        const {password, confirmPassword} = this.state;
        
        if(!password){
            errors['null'] = 'Please enter a password.';
        } else if(password.length < 7 || password.length > 19){
            errors['length'] = 'Passwords must be between 8 and 20 characters.';
        }

        if(!confirmPassword){
            errors['null'] = 'Please enter a password.';
        } else if(confirmPassword.length < 7 || confirmPassword.length > 19){
            errors['length'] = 'Passwords must be between 8 and 20 characters.';
        }

        if(password !== confirmPassword){
            errors['noMatch'] = 'Passwords do not match.'
        }
        return errors;
    }

    render(){
        const {password, confirmPassword, error, updated, errors} = this.state;

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

                            <Form.Control
                            custom
                            isInvalid={errors['null'] || errors['length'] || errors['noMatch']} 
                            type="password" placeholder="New Password" value={password}
                            onChange={e => 
                                this.setState({password: e.target.value})
                            }/><br/>

                            <Form.Control
                            custom
                            isInvalid={errors['null'] || errors['length'] || errors['noMatch']} 
                            type="password" placeholder="Confirm Password" value={confirmPassword}
                            onChange={e => 
                                this.setState({confirmPassword: e.target.value})
                            }/><br/>
                            <Form.Control.Feedback type="invalid">
                                {errors['null'] && !confirmPassword && !password
                                ? errors['null']
                                : null}
                                {errors['noMatch']
                                ? errors['noMatch'] + '\n'
                                : null}
                                {errors['length']
                                ? errors['length']+ '\n'
                                : null}
                            </Form.Control.Feedback>      
                            <button className="form-button" onClick={e => {
                                this.updatePassword(e)
                            }}>Reset</button>

                            {updated
                            ? <><br/><p>Your password has been successfully reset, please try logging in again.</p>
                            <button className="form-button" onClick={e => {
                                this.props.history.push('/')
                            }}>Home</button></>
                            : null}
                        </div>
                    </div>
                </div>
            );
        }
    }

}