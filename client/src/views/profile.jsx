import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import auth from '../components/auth';
import { createPost } from '../components/createPost';
import GetPosts  from '../components/getPosts';
import TestGetPostsList from '../components/testGetPostsList';


export const Profile = props => {
    const [newPost, setNewPost] = useState("");
    const [user, setUser] = useState(props.location.state);

    return (
        <>
            <div className="card-container">
                
                <div className="profile-container">
                <Card>
                    <Card.Body>

                        <img className="logostyle" src="/mp-logo.png" alt="logo"/>

                        <br></br>
                        <Card.Title><b>Protected</b> Dashboard</Card.Title>
                        <br></br>

                        <h3>Welcome {user.firstname} {user.lastname} </h3>
                        <br></br>
                        <p><b>Username:</b> {user.username}</p>
                        <p><b>Email: </b>{user.email}</p>
                        <br></br>
                        
                        <button className="btn btn-primary btn-lg btn-block" onClick={() => {
                            props.history.push({
                                pathname: "/getData",
                                state: {auth: true}
                            });
                        }}> View All Users </button>

                        <button className="btn btn-danger btn-lg btn-block" onClick={() => {
                            auth.logout(() => {
                                props.history.push({
                                    pathname:"/login",
                                    state: {loggedOut: true}
                                });
                            });
                        }}> Logout</button>

                    </Card.Body>
                </Card>
                </div>
            </div>
            
            <div className="card-container">
                <div className="user-posts-container">
                    <Card>
                        <Card.Body>
                            <br></br>
                            <Card.Title><h3>New Post</h3></Card.Title>

                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="What's on your mind?" name="newPost" id="newPost" onChange={e => setNewPost(e.target.value)}/>
                            </div>
                            <button className="btn btn-success btn-md btn-block" onClick={() => {
                                createPost({newPost}, user, (res) => {
                                    window.location.reload();
                                })
                            }}> Add New Post</button>
                        </Card.Body>
                    </Card>

                    <div className="post-list-container">
                        <Card>
                            <Card.Body>
                                <h3>Your Posts:</h3>
                                {/* <GetPosts user={user}/> */}
                                <TestGetPostsList user={user} />
                            
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}