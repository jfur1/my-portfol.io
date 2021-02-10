import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap'
import { AlertMsg } from '../components/alerts';

// Import Components
import { NavBar } from './navbar';
import { Home } from './home';
import { About } from './about';
import { Portfolio } from './portfolio';
import { Contact } from './contact';


class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.user !== 'undefined') ? this.props.location.state.user : null,
            
            key: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.key !== 'undefined') ? this.props.location.state.key : "home",
            
            ownedByUser: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.ownedByUser !== 'undefined') ? this.props.location.state.ownedByUser : false,
            
            alert: null,

            loggedIn: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.loggedIn !== 'undefined') ? this.props.location.state.loggedIn : false,

            requestedBy: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.requestedBy !== 'undefined') ? this.props.location.state.requestedBy : null,

            about: (typeof this.props.location.about !== 'undefined') ? this.props.location.state.about : null,

            portfolio: (typeof this.props.location.portfolio !== 'undefined') ? this.props.location.state.portfolio : null,

            contact: (typeof this.props.location.contact !== 'undefined') ? this.props.location.state.contact : null,

            education: (typeof this.props.location.education !== 'undefined') ? this.props.location.state.education : null,

            hobbies: (typeof this.props.location.hobbies !== 'undefined') ? this.props.location.state.hobbies : null,

            skills: (typeof this.props.location.skills !== 'undefined') ? this.props.location.state.skills : null,

            projects: (typeof this.props.location.projects !== 'undefined') ? this.props.location.state.projects : null,
        }
    }

    // GET profile data, then determine if the user owns this profile
    async componentDidMount(){
        //console.log("Auth.isAuthenitcated(): ", auth.isAuthenticated());
        //console.log("Component Mounted with STATE:", this.state);
        //console.log("Component Mounted with PROPS:", this.props.location.state);
        var pathname = window.location.pathname.substr(1, window.location.pathname.length);
        
        const urls = [
            'http://localhost:5000/getUserData',
            'http://localhost:5000/about',
            'http://localhost:5000/portfolio',
            'http://localhost:5000/contact',
            'http://localhost:5000/education',
            'http://localhost:5000/hobbies',
            'http://localhost:5000/skills',
            'http://localhost:5000/projects'
        ];

        let [data, about, portfolio, contact, education, hobbies, skills, projects] = await 
        Promise.all(urls.map(url => 
            fetch(url, {
                method: 'GET',
                headers: {username: pathname}, 
                mode: 'cors',
                credentials: 'include',
                withCredentials: true,
            })
            .then((res) => res.json())
        ))

        //console.log("Profile Recieved Server Response: ", data);

        // If no profile found, redirect back to splash page w/ error msg
        if((typeof data !== 'undefined') && data["error"]){
            
            if(!(typeof data.requestedBy !== 'undefined')){
                return this.props.history.push({
                    pathname: '/',
                    errorMsg: (pathname !== "dashboard") ? `Unable to locate user: ${pathname}` : null,
                })
            } 
            else{
                this.props.history.push({
                    pathname: `/${data.requestedBy.username}`,
                    errorMsg: `Unable to locate user: ${pathname}`,
                    state: {
                        user: data.requestedBy,
                        key: "home",
                        ownedByUser: this.state.ownedByUser,
                        loggedIn: this.state.loggedIn,
                        requestedBy: data.requestedBy,
                        about: this.state.about,
                        portfolio: this.state.portfolio,
                        contact: this.state.contact,
                        education: this.state.education,
                        hobbies: this.state.hobbies,
                        skills: this.state.skills,
                        projects: this.state.projects
                    }
                })
                window.location.reload();
            }
        }else{
            // If user was found => Store in state
            //console.log("Found user: ", data.user);
            this.setState({
                user: data.user, 
                requestedBy: data.requestedBy,
                about: about,
                portfolio: portfolio,
                contact: contact,
                education: education,
                hobbies: hobbies,
                skills: skills,
                projects: projects
            });
        }

        // Regardless of whether the current user matches the profile, a user must always be logged-in in order to edit their profile
        if(typeof this.state.requestedBy !== 'undefined' && typeof this.state.user !== 'undefined' && this.state.requestedBy !== null && this.state.user !== null && this.state.requestedBy.user_id === this.state.user.user_id){
            console.log("Profile owned by user!");
            this.setState({ownedByUser: true});
        }

        if(typeof this.state.requestedBy !== 'undefined'){
            this.setState({loggedIn: true});
        }

        if(typeof this.props.location.state.errorMsg !== 'undefined'){
            this.setState({alert: AlertMsg("error", this.props.location.state.errorMsg)}); 
        }

        console.log("STATE: ", this.state);
        console.log("PROPS: ", this.props.location.state);
    }

    // Keeps track of what tab we're on, for the event of user refresh
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
                        requestedBy: this.state.requestedBy,
                        about: this.state.about,
                        portfolio: this.state.portfolio,
                        contact: this.state.contact,
                        education: this.state.education,
                        hobbies: this.state.hobbies,
                        skills: this.state.skills,
                        projects: this.state.projects
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
                    requestedBy: this.state.requestedBy,
                    about: this.state.about,
                    portfolio: this.state.portfolio,
                    contact: this.state.contact,
                    education: this.state.education,
                    hobbies: this.state.hobbies,
                    skills: this.state.skills,
                    projects: this.state.projects
                }
            })
        }
    }
    
    updateLocation = async (locationToUpdate, user_id) => {
        const response = await fetch('http://localhost:5000/updateLocation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id, 
                location: locationToUpdate}
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        this.setState({
            about: {
                ...this.state.about,
                location: data
            }
        });
        console.log(this.state.about);
    }

    updateBio = async(bioToUpdate, user_id) => {
        const response = await fetch('http://localhost:5000/updateBio',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id, 
                bio: bioToUpdate}
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        this.setState({
            about: {
                ...this.state.about,
                bio: data
            }
        });
        console.log(this.state.about);
    }
    
    updateHobby = async(hobby_id, hobby, user_id, rowIdx) => {
        const response = await fetch('http://localhost:5000/updateHobby',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                hobby_id: hobby_id, 
                hobby: hobby,
                user_id: user_id
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);

        let tmpHobbies = [...this.state.hobbies];
        let row = {...tmpHobbies[rowIdx]};
        row.hobby = data;
        tmpHobbies[rowIdx] = row;
        this.setState({hobbies: tmpHobbies});

        console.log(this.state.hobbies);
    }


    render(){

        return(
            <div className="container">
                <NavBar {...this.props} data={this.state}/>
                {alert}

                <div className="user-container">
                    <Tabs
                    activeKey={this.state.key}
                    onSelect={(k) => this.setState({key: k})}
                        >
                        <Tab eventKey="home" title="Home" />
                        <Tab eventKey="about" title="About" />
                        <Tab eventKey="portfolio" title="Portfolio" />
                        <Tab eventKey="contact" title="Contact" />
                    </Tabs>
                </div>

                <div className="info-container">
                    { this.state.key === "home" ? 
                        <Home {...this.props} data={this.state} />
                    : null }

                    { this.state.key === "about" ?  
                        <About {...this.props} 
                            data={this.state} 
                            updateLocation={this.updateLocation}
                            updateBio={this.updateBio}
                            updateHobby={this.updateHobby}
                        />
                    : null }

                    { this.state.key === "portfolio" ?
                        <Portfolio {...this.props} data={this.state}/>
                    : null }

                    { this.state.key === "contact" ?
                        <Contact {...this.props} data={this.state}/>
                    : null }
                </div>
            </div>
        );
    }

}

export default Profile;