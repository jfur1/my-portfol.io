import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

class Splash extends Component {
  render() {
    return (
    <div className="App">
      <div className="card-container">
        <Card style={{width: '35rem'}}>
          <Card.Body>
            <a href="/home">
                <img className="logostyle" src="/mp-logo.png" alt="logo"/>
            </a>
            <br></br>
            <Card.Title>Create an account or login</Card.Title>
            <br></br>
            <a href="./register" className="btn btn-primary btn-block mb-2"
            >Register</a>
            <br></br>
            <a href="./login" className="btn btn-primary btn-block">Login</a>
          </Card.Body>
        </Card>
      </div>
    </div>
    );
  }
}
export default Splash;
