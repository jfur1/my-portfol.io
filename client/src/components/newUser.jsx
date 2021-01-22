import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';

class User extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            hidden: true
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
        console.log(this.state);
        const data = { firstname: this.state.firstname, lastname: this.state.lastname, email: this.state.email, password: this.state.password};
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
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    render(){
        return(
            <div className="container">
                <img className="logostyle" src="/mp-logo.png" alt="logo" />
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Enter First Name"name="firstname" value={this.state.firstname} onChange={this.handleInputChange}/>
                            </div>
                            
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Enter Last Name" name="lastname" value={this.state.lastname} onChange={this.handleInputChange}/>
                            </div>
                            
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Enter Email" name="email" value={this.state.email} onChange={this.handleInputChange}/>
                            </div>
                            
                            <div className="form-group">
                                <input type={this.state.hidden ? 'password' : 'text'} className="form-control" placeholder="Enter Password" name="password" value={this.state.password} id="password" onChange={this.handleInputChange} />
                                
                                <input type="checkbox" onChange={this.handleInputChange}/> Show Password
                            </div>
                            
                            <div className="form-group">
                                <input className="btn btn-dark btn-lg btn-block" type="submit" value="Submit"/>
                            </div>
                        </form>
            </div>
        );
    }
}

export default User;