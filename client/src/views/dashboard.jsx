import React from 'react';
import { Card } from 'react-bootstrap';
import auth from '../components/auth';

export const Dashboard = props => {
    //console.log(props);
    return (
        <div className="card-container">
            <Card style={{width: '35rem'}}>
                <Card.Body>

                    <img className="logostyle" src="/mp-logo.png" alt="logo"/>


                    <br></br>
                    <Card.Title><b>Protected</b> Dashboard</Card.Title>
                    <br></br>

                    <button className="btn btn-danger btn-lg btn-block" onClick={() => {
                        auth.logout(() => {
                            props.history.push("/login");
                        });
                    }}> Logout</button>

                </Card.Body>
            </Card>
        </div>
    );
}