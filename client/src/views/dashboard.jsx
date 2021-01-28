import React from 'react';
import { Card } from 'react-bootstrap';
import auth from '../components/auth';


export const Dashboard = props => {

    console.log("Props.Location.State: ", props.location.state);

    // Fetch User Data
    const user = props.location.state;

    return (
        <div className="card-container">
            <Card style={{width: '35rem'}}>
                <Card.Body>

                    <img className="logostyle" src="/mp-logo.png" alt="logo"/>

                    <br></br>
                    <Card.Title><b>Protected</b> Dashboard</Card.Title>
                    <br></br>

                    <h3>Welcome {user.firstname} {user.lastname} </h3>
                    <br></br>
                    <p><b>Username:</b> {user.username}</p>
                    <p><b>Email: </b>{user.email}</p>
                    
                    <button className="btn btn-primary btn-lg btn-block" onClick={() => {
                        props.history.push("/getData");
                    }}> View Database </button>

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