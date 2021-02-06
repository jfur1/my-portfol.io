import React from 'react';
import { Card } from 'react-bootstrap';
import { AlertMsg } from '../components/alerts';

export const Welcome = props => {
    let alert;
    console.log(props)
    if(!(typeof(props.location) !== 'undefined')){
        alert = null;
    }
    // Alert for successful logout
    else if(typeof props.location["errorMsg"] !== 'undefined'){
        console.log(props.location["errorMsg"]);
        alert = AlertMsg("error", props.location["errorMsg"]);
    }

    return (
        <div className="splash-container">
            <Card style={{width: '35rem'}}>
            <Card.Body>
                <img className="logostyle" src="/mp-new-logo-beta.png" alt="logo"/>

                <br></br>
                <Card.Title>Create an account or login.</Card.Title>

                <div className="alert-container mb-2">
                    {alert}
                </div>


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