import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import Alert from '@material-ui/lab/Alert';

function AlertMsg(props){
    return(
        <div className="alert-container">
        {/* severity: {error, warning, info, success} */}
        <Alert severity={props.type}>{props.msg}</Alert>
        </div>
    );
}

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            hidden: true,
            errors: {},
            newUser: null,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        // If props are undefined (not redirected from ./register), then we render normally (newUser = false)
        // Else, props are defined and we render for a new user (newUser = true)
        this.props.location.state !== undefined ? this.state.newUser = true : this.state.newUser = false;

        console.log("this.props.location.state: ", this.props.location.state);
        console.log("this.state.newUser: ",this.state.newUser)
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
            const data = { username: this.state.username, password: this.state.password};
            console.log(data);
            /*
            fetch('http://localhost:5000/login', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });*/
        }
    }
    validate(){
        let errors = {};
        let isValid = true;
        if (!this.state.username) {
          isValid = false;
          errors["username"] = "Please enter your email address or username.";
        }
        if (!this.state.password) {
          isValid = false;
          errors["password"] = "Please enter your password.";
        }
        this.setState({errors: errors});
        return isValid;
    }

    render(){
        console.log("this.props.location.state: ", this.props.location.state);
        return(
            <div className="container">
                <a href="/home"><img className="logostyle" src="/mp-logo.png" alt="logo"/></a>
                <div className="card-container">
                <Card style={{width: '35rem'}}>
                    <Card.Body>

                    {/* If state.newUser = true, then we know the client was redirected from registration and therefore is alerted of success! */}
                    {this.state.newUser === true ? <AlertMsg type="success" msg="You were successfully registed !"></AlertMsg> : <h1>(No Alert)</h1>}

                        <h1>Login</h1>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Enter Username or Email" name="username" value={this.state.username} onChange={this.handleInputChange}/>
                                <div className="text-danger">{this.state.errors.username}</div>
                            </div>
                            <div className="form-group">
                                <input type={this.state.hidden ? 'password' : 'text'} className="form-control" placeholder="Enter Password" name="password" value={this.state.password} id="password" onChange={this.handleInputChange} />
                                <div className="text-danger">{this.state.errors.password}</div>
                                <input type="checkbox" onChange={this.handleInputChange}/> Show Password
                            </div>
                            <div className="form-group">
                                <input className="btn btn-dark btn-lg btn-block" type="submit" value="Login"/>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
                </div>
            </div>
        );
    }
}

export default Login;