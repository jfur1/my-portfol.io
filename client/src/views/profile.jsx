import React, { Component } from 'react';
import { Nav, Navbar, Card, Tabs, Tab, Dropdown } from 'react-bootstrap'
import { PersonCircle } from 'react-bootstrap-icons';
import { createPost } from '../components/createPost';
import auth from '../components/auth';
import { Post } from '../views/post';
import { AlertMsg } from '../components/alerts';


class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.user !== 'undefined') ? this.props.location.state.user : null,
            
            key: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.key !== 'undefined') ? this.props.location.state.key : "home",
            
            ownedByUser: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.ownedByUser !== 'undefined') ? this.props.location.state.ownedByUser : false,
            
            newPost: "",

            postsList: [],

            loggedIn: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.loggedIn !== 'undefined') ? this.props.location.state.loggedIn : false,

            requestedBy: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.requestedBy !== 'undefined') ? this.props.location.state.requestedBy : null,
        }
    }

    // GET profile data, then determine if the user owns this profile
    async componentDidMount(){
        console.log("Auth.isAuthenitcated(): ", auth.isAuthenticated());
        console.log("Component Mounted with STATE:", this.state);
        console.log("Component Mounted with PROPS:", this.props.location.state);
        var pathname = window.location.pathname.substr(1, window.location.pathname.length);
        console.log("URI: ", pathname);
        // Careful: Someone may be authenticated (logged in), but may be on someone else's profile page

        //const post = await this.getPosts();

        // Try and GET user data for the given profile
        const response  = await fetch('http://localhost:5000/getUserData', {
            method: 'GET',
            headers: {username: pathname}, 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
        });

        const json = await response.json();
        const data = json;

        console.log("Profile Component Recieved User Data: ", data);

        // If no profile found, redirect back to splash page w/ error msg
        if((typeof data !== 'undefined') && data["error"]){
            this.props.history.push({
                pathname: `/${data.requestedBy.username}`,
                errorMsg: `Could not find profile: ${pathname}`,
                state: {
                    user: data.requestedBy,
                    key: "home",
                    ownedByUser: this.state.ownedByUser,
                    loggedIn: this.state.loggedIn,
                    requestedBy: data.requestedBy
                }
            })
            window.location.reload();

        }else{
            // If user was found => Store in state
            this.setState({user: data.user, requestedBy: data.requestedBy});
        }

        // Regardless of whether the current user matches the profile, a user must always be logged-in in order to edit their profile
        if(typeof this.state.requestedBy !== null && typeof this.state.user !== null && this.state.requestedBy.user_id == this.state.user.user_id){
            console.log("Profile owned by user!");
            this.setState({ownedByUser: true});
        }

        if(typeof this.state.requestedBy !== null){
            this.setState({loggedIn: true});
        }

        let alert;
        if(typeof this.props.location.state.errorMsg !== 'undefined'){
            alert = AlertMsg("error", this.props.location.state.errorMsg);  
        }

        console.log("STATE: ", this.state);
        console.log("PROPS: ", this.props.location.state);
        console.log("POSTS:", this.state.postsList);
    }

    // Retrieves the list of user's posts
    getPosts = async () => {
        var pathname = window.location.pathname.substr(1, window.location.pathname.length);

        await fetch('http://localhost:5000/getPosts',{
            method: 'GET',
            headers: {username: pathname}, 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
        })
        .then(response => {
            //console.log("Get Posts Response: ", response);
            return response.json();
        })
        .then(list => {this.setState({postsList: list})});
    }

    // Keeps track of what tab we're on, in the event of user refresh
    componentDidUpdate(){
        if(typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.key !== 'undefined'){
            if(this.state.key !== this.props.location.state.key){
                console.log("Saving a new Key: ", this.state.key);
                console.log("State:", this.state);
                this.props.history.push({
                    pathname: `/${this.state.user.username}`,
                    state: {
                        user: this.state.user,
                        key: this.state.key,
                        ownedByUser: this.state.ownedByUser,
                        loggedIn: this.state.loggedIn,
                        requestedBy: this.state.requestedBy
                    }
                })
                return;
            }
        } else{
            this.props.history.push({
                pathname: `/${this.state.user.username}`,
                state: {
                    user: this.state.user,
                    key: "home",
                    ownedByUser: this.state.ownedByUser,
                    loggedIn: this.state.loggedIn,
                    requestedBy: this.state.requestedBy
                }
            })
        }
    }
      
    render(){
        const user = this.props.location.state;

        return(
            <div className="container">
                <Navbar>
                    <Navbar.Brand href="/dashboard"><img style={{height: "30px"}} src="/mp-new-logo-beta.png" alt="logo"/></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse className="justify-content-end">
                    {this.state.loggedIn ? 
                        <Nav.Item>
                            <Navbar.Text className="mr-sm-2">
                                Signed in as: <b>{this.state.requestedBy.first_name} {this.state.requestedBy.last_name}</b>
                            </Navbar.Text>
                        </Nav.Item>
                        : null}
                        <Nav.Item>
                            <Dropdown id="collapsible-nav-dropdown">
                                <Dropdown.Toggle className="bg-transparent text-dark" id="dropdown-custom-components">
                                    <PersonCircle size={50}/>
                                </Dropdown.Toggle>
                                {this.state.loggedIn ?
                                <Dropdown.Menu>
                                    {/*Could use eventKey to trigger edit profile modal/component*/}
                                    <Dropdown.Item><Nav.Link>Edit Profile</Nav.Link></Dropdown.Item>
                                    <Dropdown.Item>
                                        <Nav.Link onClick={() => {
                                            auth.logout(() => {
                                                this.props.history.push({
                                                    pathname:"/login",
                                                    state: {loggedOut: true}
                                                });
                                            });
                                        }}>Logout</Nav.Link>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                                :         
                                <Dropdown.Menu>
                                    <Dropdown.Item>                          
                                    <Nav.Link onClick={() => {this.props.history.push("/login");
                                    }}>Login</Nav.Link>
                                    </Dropdown.Item>
                                </Dropdown.Menu>  }
                            </Dropdown>
                        </Nav.Item>
                        
                    </Navbar.Collapse>
                </Navbar>
                {alert}
                {/* Make a tab-container later for styling */}
                <div className="user-container">
                    <Tabs
                    activeKey={this.state.key}
                    onSelect={(k) => this.setState({key: k})}
                        >
                        <Tab eventKey="home" title="Home" />
                        <Tab eventKey="about" title="About" />
                        <Tab eventKey="portfolio" title="Portfolio" />
                        <Tab eventKey="contact" title="Contact" />
                        {/* {this.state.ownedByUser ? <Tab eventKey="edit" title="Edit" /> : null} */}
                        
                    </Tabs>
                </div>

                <div className="info-container">
                    { this.state.key === "home" ? 
                    <div className="profile-container">
                        <Card>
                            <Card.Body>
                                <br></br>
                                <Card.Title>Home</Card.Title>
                                <br></br>

                                {this.state.user !== null && typeof this.state.user !== 'undefined'? 
                                <><h3>{this.state.user.firstname} {this.state.user.lastname} </h3>
                                <br></br>
                                <p><b>Username:</b> {this.state.user.username}</p>
                                <p><b>Email: </b>{this.state.user.email}</p>
                                <br></br></> 
                                : null}
                            </Card.Body>
                        </Card>
                    </div> : null }

                    { this.state.key === "about" ?  
                    <div style={{overflow: 'scroll', height: '500px'}}>
                        <div className="profile-container">
                            <Card>
                                <Card.Body>
                                    <Card.Title><h3>New Post</h3></Card.Title>

                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="What's on your mind?" name="newPost" id="newPost" onChange={e => this.setState({newPost: e.target.value})}/>
                                    </div>
                                    <button className="btn btn-success btn-md btn-block" onClick={() => {
                                        createPost(this.state.newPost, this.state.user, (res) => {
                                            this.props.history.push({
                                                pathname: `/${this.state.user.username}`,
                                                state: this.state
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
                                            <h2>No Posts Found</h2>
                                        </div>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div> : null}

                    { this.state.key === "portfolio" ?
                    <div className="resume-container"><p>Portfolio Page</p></div> : null}

                    { this.state.key === "contact" ?
                    <div className="resume-container">
                        {/* <UploadProfilePicture {...this.props}/> */}
                    </div> : null}

                    { this.state.key === "edit" && this.state.ownedByUser ?
                    <div className="resume-container"><p>Edit Profile</p></div> : null}

            </div>

        </div>
        );
    }

}

export default Profile;