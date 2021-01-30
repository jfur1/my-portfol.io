import React, { useState, useEffect } from 'react';
import { Card, Nav, Navbar } from 'react-bootstrap';
import auth from '../components/auth';
import { createPost } from '../components/createPost';
import { Post } from '../views/post';
import { Gear } from 'react-bootstrap-icons';
import { Portfolio } from './portfolio';

export const Profile = props => {
    const [newPost, setNewPost] = useState("");
    const [user, setUser] = useState(props.location.state);
    const [postsList, setPostsList] = useState("");

    console.log("Props:", props);
    const [toggleMap, setToggleMap] = useState(props.location.state["toggleMap"]);

    const [hiddenAbout, setHiddenAbout] = useState(toggleMap[0]);
    const [hiddenPosts, setHiddenPosts] = useState(toggleMap[1]);
    const [hiddenPortfolio, setHiddenPortfolio] = useState(toggleMap[2]);
    const [hiddenResume, setHiddenResume] = useState(toggleMap[3]);

    const saveToggle = () => {
        user["toggleMap"] = [hiddenAbout, hiddenPosts, hiddenPortfolio, hiddenResume];
        setToggleMap([hiddenAbout, hiddenPosts, hiddenPortfolio, hiddenResume]);
        props.history.push({
            pathname: '/dashboard',
            state: user
        })
        return;
    }

    // Retrieves the list of items from the Express app
    const getPosts = async () => {
        fetch('http://localhost:5000/getPosts',{
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          withCredentials: true,
        })
        .then(response => {
          //console.log("Get Posts Response: ", response);
          return response.json();
        })
        .then(list => {setPostsList(list)})
    }

    useEffect(() => {
        getPosts();
        // console.log("Posts: ", postsList);
        return () => {}
    }, []);

    return (
        <>
            <div className="container">
                <Navbar>
                    <Navbar.Brand href="/dashboard"><img style={{height: "50px"}} src="/mp-logo.png" alt="logo"/></Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: <a href="/dashboard">{user.firstname} {user.lastname}</a>
                        </Navbar.Text>
                        <br/>
                        <Nav.Link onClick={() => {
                                    auth.logout(() => {
                                        props.history.push({
                                            pathname:"/login",
                                            state: {loggedOut: true}
                                        });
                                    });
                                }}>Logout</Nav.Link>
                        <br/>
                        <Nav.Link href="#"><Gear size={50}/></Nav.Link>
                    </Navbar.Collapse>
                </Navbar>
                <div className="user-container">
                    <h2>{user.firstname} {user.lastname}</h2>
                    <div className="btn-group-toggle profile-nav">
                        <button className="btn btn-outline-dark" onClick={() => { setHiddenAbout(true); setHiddenPosts(false); setHiddenPortfolio(false); setHiddenResume(false); saveToggle();}}>About</button>
                        <button className="btn btn-outline-dark" onClick={() => { setHiddenPosts(true); setHiddenAbout(false); setHiddenPortfolio(false); setHiddenResume(false); saveToggle();}}>Posts</button>
                        <button className="btn btn-outline-dark" onClick={() => { setHiddenPortfolio(true); setHiddenAbout(false); setHiddenPosts(false); setHiddenResume(false); saveToggle();}}>Portfolio</button>
                        <button className="btn btn-outline-dark" onClick={() => { setHiddenResume(true); setHiddenAbout(false); setHiddenPortfolio(false); setHiddenPosts(false); saveToggle();}}>Resume</button>
                    </div>
                </div>
                <div class="info-container">
                    { hiddenAbout ? 
                    <div className="profile-container">
                        <Card>
                            <Card.Body>
                                <br></br>
                                <Card.Title><b>Protected</b> Profile</Card.Title>
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
                    </div> : null }
                
                    { hiddenPosts ?  
                    <div>
                        <div className="user-posts-container">
                            <Card>
                                <Card.Body>
                                    <Card.Title><h3>New Post</h3></Card.Title>

                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="What's on your mind?" name="newPost" id="newPost" onChange={e => setNewPost(e.target.value)}/>
                                    </div>
                                    <button className="btn btn-success btn-md btn-block" onClick={() => {
                                        createPost({newPost}, user, (res) => {
                                            user["toggleMap"] = [hiddenAbout, hiddenPosts, hiddenPortfolio, hiddenResume];
                                            props.history.push({
                                                pathname: '/dashboard',
                                                state: user
                                            })
                                            window.location.reload();
                                        })
                                    }}> Add New Post</button>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="post-list-container">
                            <Card>
                                <Card.Body>
                                    <h3>Your Posts:</h3>
                                    <div className="posts">

                                    {postsList.length ? (
                                        <div>
                                            {postsList.map((sublist, idx) => {
                                            return(
                                                <Post data={sublist} key={idx}/>
                                            );
                                        })}
                                        </div>
                                    ) : (
                                    <div>
                                        {/* Comment Out: Avoids the temporary "No items found" img upon our initial render (looks smoother).*/}
                                        <h2>No Posts Found</h2>
                                    </div>
                                    )
                                    }
                                    </div>
                                    
                                </Card.Body>
                            </Card>
                        </div>
                    </div> : null}
                    { hiddenPortfolio ?
                    <div className="portfolio-container"><Portfolio {...props} /></div> : null}
                    { hiddenResume ?
                    <div className="resume-container"><p>Resume Content</p></div> : null}
                </div>
            </div>
        </>
    );
}