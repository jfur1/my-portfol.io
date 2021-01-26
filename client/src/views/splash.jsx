import React, { Component } from 'react';
import { Card, Nav, Navbar } from 'react-bootstrap';

class Splash extends Component {
  render() {
    return (
    <div className="App" style={{backgroundImage: 'url("/mp-background.jpg")', backgroundPosition: '0 0 center', backgroundSize: 'cover'}}>
      <div className="card-container">
        <Card style={{width: '35rem'}}>
          <Card.Body>
            <a href="/home">
                <img className="logostyle" src="/mp-logo.png" alt="logo"/>
            </a>
            <br></br>
            <Card.Title>Create an account or login</Card.Title>
            <br></br>
            <a href="./register" className="btn btn-dark btn-lg btn-block">Register</a>
            <br></br>
            <a href="./login" className="btn btn-dark btn-lg btn-block">Login</a>
          </Card.Body>
        </Card>
      </div>
    </div>
    );
  }
}
export default Splash;
