import React, { Component } from 'react';
import { Nav, Navbar, Card, Tabs, Tab } from 'react-bootstrap'
import { Gear } from 'react-bootstrap-icons';
import { createPost } from '../components/createPost';
import auth from '../components/auth';
import { Portfolio } from '../views/portfolio';
import { Post } from '../views/post';

class Profile2 extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: this.props.location.state,
            key: this.props.location.state["key"] || "home",
            newPost: "",
            postsList: []
        }
    }

    // GET posts whenever we render -- TODO: implement conditional rendering
    componentDidMount(){
        console.log("Component Mounted. Getting posts now...")
        this.getPosts();
    }

    // Retrieves the list of user's posts
    getPosts = async () => {
        await fetch('http://localhost:5000/getPosts',{
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
        })
        .then(response => {
            //console.log("Get Posts Response: ", response);
            return response.json();
        })
        .then(list => {this.setState({postsList: list})})
    }

    // Keeps track of what tab we're on, in the event of user refresh
    componentDidUpdate(){
        if(this.state["key"] !== this.props.location.state["key"]){
            console.log("Saving a new Key: ", this.state["key"]);
            
            const user = this.props.location.state;
            user["key"] = this.state["key"];
            
            this.props.history.push({
                pathname: '/dashboard',
                state: user
            })
            return;
        }
    }
      
    render(){
        const user = this.props.location.state;
        return(
            <div className="container">
                <Navbar>
                    <Navbar.Brand href="/dashboard"><img style={{height: "30px"}} src="/mp-new-logo-beta.png" alt="logo"/></Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: <a href="/dashboard">{user.firstname} {user.lastname}</a>
                        </Navbar.Text>
                        <br/>
                        <Nav.Link onClick={() => {
                            auth.logout(() => {
                                this.props.history.push({
                                    pathname:"/login",
                                    state: {loggedOut: true}
                                });
                            });
                        }}>Logout</Nav.Link>
                        <br/>
                        <Nav.Link href="#"><Gear size={50}/></Nav.Link>
                    </Navbar.Collapse>
                </Navbar>

                {/* Make a tab-container later for styling */}
                <div className="user-container">
                    <Tabs
                    activeKey={this.state.key}
                    onSelect={(k) => this.setState({key: k})}
                        >
                        <Tab eventKey="home" title="Home" />
                        <Tab eventKey="posts" title="Posts" />
                        <Tab eventKey="portfolio" title="Portfolio" />
                        <Tab eventKey="contact" title="Contact" />
                        <Tab eventKey="edit" title="Edit" />
                    </Tabs>
                </div>

                <div className="info-container">
                    { this.state["key"] === "home" ? 
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
                                
                                <button className="btn btn-success btn-lg btn-block" onClick={() => {
                                    this.props.history.push({
                                        pathname: "/getData",
                                        state: {auth: true}
                                    });
                                }}> View All Users </button>

                                <button className="btn btn-success btn-lg btn-block" onClick={() => {
                                    auth.logout(() => {
                                        this.props.history.push({
                                            pathname:"/login",
                                            state: {loggedOut: true}
                                        });
                                    });
                                }}> Logout</button>

                            </Card.Body>
                        </Card>
                    </div> : null }

                    { this.state["key"] === "posts" ?  
                    <div style={{overflow: 'scroll', height: '500px'}}>
                        <div className="profile-container">
                            <Card>
                                <Card.Body>
                                    <Card.Title><h3>New Post</h3></Card.Title>

                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="What's on your mind?" name="newPost" id="newPost" onChange={e => this.setState({newPost: e.target.value})}/>
                                    </div>
                                    <button className="btn btn-success btn-md btn-block" onClick={() => {
                                        createPost(this.state.newPost, user, (res) => {
                                            this.props.history.push({
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

                                    {this.state.postsList.length ? (
                                        <div className="post-list">
                                            {this.state.postsList.map((sublist, idx) => {
                                            return(
                                                <Post data={sublist} key={idx} />
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

                    { this.state["key"] === "portfolio" ?
                    <div className="portfolio-container"><Portfolio {...this.props} /></div> : null}

                    { this.state["key"] === "contact" ?
                    <div className="resume-container"><p>Contact Page</p></div> : null}

                    { this.state["key"] === "edit" ?
                    <div className="resume-container"><p>Edit Profile</p></div> : null}

            </div>

        </div>
        );
    }

}

export default Profile2;