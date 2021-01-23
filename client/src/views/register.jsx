import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { Route, Redirect } from 'react-router-dom';

class newUser extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            password: "",
            confirmpassword: "",
            hidden: true,
            redirect: null,
            errors: {}
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleInputChange(event){
        const target = event.target;
        if(target.type === 'checkbox'){
            this.setState({ hidden: !this.state.hidden });
        }
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    handleSubmit(event){
        //where connection to database should be established
        event.preventDefault();
        if(this.validate()){
            console.log(this.state);
            const data = { firstname: this.state.firstname, lastname: this.state.lastname, username: this.state.username, email: this.state.email, password: this.state.password};
            console.log(data);
            fetch('http://localhost:5000/newUser', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                this.setState({redirect: '/login'});
                return;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }

    validate(){
        let errors = {};
        let isValid = true;
    
        if (!this.state.firstname) {
          isValid = false;
          errors["firstname"] = "Please enter your first name.";
        }
        if (!this.state.lastname) {
            isValid = false;
            errors["lastname"] = "Please enter your last name.";
          }
        if (!this.state.email) {
          isValid = false;
          errors["email"] = "Please enter your email Address.";
        }
        if (typeof this.state.email !== "undefined") {
          var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
          if (!pattern.test(this.state.email)) {
            isValid = false;
            errors["email"] = "Please enter valid email address.";
          }
        }
        if (!this.state.password) {
          isValid = false;
          errors["password"] = "Please enter your password.";
        }
        if (!this.state.confirmpassword) {
          isValid = false;
          errors["confirm_password"] = "Please enter your confirm password.";
        }
        if (typeof this.state.password !== "undefined" && typeof this.state.confirmpassword !== "undefined") {
            
          if (this.state.password !== this.state.confirmpassword) {
            isValid = false;
            errors["passwordmatch"] = "Passwords don't match.";
          }
        } 
        this.setState({errors: errors});
        return isValid;
    }


    render(){
        if(this.state.redirect){
            return (
                <Redirect 
                    to={{
                        pathname: this.state.redirect,
                        state: 'You are now registered and can login to your account!'
                    }} 
                />
            );
        }
        else{
            return(
                <div className="container">
                    <a href="/home"><img className="logostyle" src="/mp-logo.png" alt="logo"/></a>
                    <div className="card-container">
                    <Card style={{width: '35rem'}}>
                        <Card.Body>
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Enter First Name"name="firstname" value={this.state.firstname} onChange={this.handleInputChange}/>
                                    <div className="text-danger">{this.state.errors.firstname}</div>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Enter Last Name" name="lastname" value={this.state.lastname} onChange={this.handleInputChange}/>
                                    <div className="text-danger">{this.state.errors.lastname}</div>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Enter Username" name="username" value={this.state.username} onChange={this.handleInputChange}/>
                                    <div className="text-danger">{this.state.errors.username}</div>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Enter Email" name="email" value={this.state.email} onChange={this.handleInputChange}/>
                                    <div className="text-danger">{this.state.errors.email}</div>
                                </div>
                                <div className="form-group">
                                    <input type={this.state.hidden ? 'password' : 'text'} className="form-control" placeholder="Enter Password" name="password" value={this.state.password} id="password" onChange={this.handleInputChange} />
                                    <div className="text-danger">{this.state.errors.password}</div>
                                    <input type="checkbox" onChange={this.handleInputChange}/> Show Password
                                    <br/>
                                    <input type={this.state.hidden ? 'password' : 'text'} className="form-control" placeholder="Confirm Password" name="confirmpassword" value={this.state.confirmpassword} id="confirmpassword" onChange={this.handleInputChange} />
                                    <div className="text-danger">{this.state.errors.confirmpassword}</div>
                                    <div className="text-danger">{this.state.errors.passwordmatch}</div>
                                </div>
                                <div className="form-group">
                                <input className="btn btn-dark btn-lg btn-block" type="submit" 
                                value="Register"/>
                                </div>
                            </form>
                        </Card.Body>
                    </Card>
                    </div>
                </div>
            );
        }
    }
}

export default newUser;