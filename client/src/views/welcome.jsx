import React from 'react';
import { Card } from 'react-bootstrap';

export const Welcome = props => {
    return (
        <div className="splash-container">
            <Card style={{width: '35rem'}}>
            <Card.Body>
                <img className="logostyle" src="/mp-new-logo.png" alt="logo"/>

                <br></br>
                <Card.Title>Create an account or login</Card.Title>
                <br></br>

                <button className="btn btn-success btn-lg btn-block" onClick={() => {
                    props.history.push({
                        pathname: "/register",
                        state: {isRegistered: false, failedAttempt: false, emailTaken: false, errors: []}
                        });
                    }
                }>Register</button>

                <br></br>

                <button className="btn btn-success btn-lg btn-block" onClick={() => {
                    props.history.push("/login");
                    }
                }>Login</button>

            </Card.Body>
            </Card>
        </div>
    );
}