import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

class Home extends Component {
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
                    <Card.Title>Dashboard</Card.Title>
                    <br></br>
                    {/* Replaced Link with href here so that we force a refresh (want to get newest data!) */}
                    {/* <Link to={'./getData'}> */}
                    {/* </Link> */}
                    <a href="/getData" className="btn btn-danger btn-block">View Database</a>
                    <br></br>
                    <a href="/register" className="btn btn-danger btn-block">
                        Sign Up
                    </a>
                </Card.Body>
            </Card>
        </div>
    </div>
    );
  }
}
export default Home;