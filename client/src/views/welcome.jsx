import React from 'react';
import { Card } from 'react-bootstrap';

export const Welcome = props => {
    return (
        <div className="card-container">
            <Card style={{width: '35rem'}}>
            <Card.Body>
                <img className="logostyle" src="/mp-logo.png" alt="logo"/>

                <br></br>
                <Card.Title>Create an account or login</Card.Title>
                <br></br>

                <button className="btn btn-danger btn-lg btn-block" onClick={() => {
                    props.history.push("/register");
                    }
                }>Register</button>

                <br></br>

                <button className="btn btn-danger btn-lg btn-block" onClick={() => {
                    props.history.push("/login");
                    }
                }>Login</button>

            </Card.Body>
            </Card>
        </div>
    );
}