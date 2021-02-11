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

            profile: (typeof this.props.location.profile !== 'undefined') ? this.props.location.state.profile : null,

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
            'http://localhost:5000/profile',
            'http://localhost:5000/portfolio',
            'http://localhost:5000/contact',
            'http://localhost:5000/education',
            'http://localhost:5000/hobbies',
            'http://localhost:5000/skills',
            'http://localhost:5000/projects'
        ];

        let [data, about, profile, portfolio, contact, education, hobbies, skills, projects] = await 
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
        if((typeof data !== 'undefined') && data["error"] && window.location.hostname === 'localhost'){
            
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
                        projects: this.state.projects,
                        profile: this.state.profile
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
                profile: profile,
                portfolio: portfolio,
                contact: contact,
                education: education,
                hobbies: hobbies,
                skills: skills,
                projects: projects,
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
                //console.log("State:", this.state);
                this.props.history.push({
                    pathname: `/${this.state.user.username}`,
                    state: {
                        user: this.state.user,
                        key: this.state.key,
                        ownedByUser: this.state.ownedByUser,
                        loggedIn: this.state.loggedIn,
                        requestedBy: this.state.requestedBy,
                        about: this.state.about,
                        profile: this.state.profile,
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
                    profile: this.state.profile,
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
        console.log("Profile.jsx Updated Location. this.state.about:",this.state.about);
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
        console.log("Profile.jsx Updated Bio. this.state.about:", this.state.about);
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

        console.log("Profile.jsx Updated the hobby. this.state.hobbies:",this.state.hobbies);
    }

    updateSkill = async(skill_id, skill, user_id, rowIdx) => {
        const response = await fetch('http://localhost:5000/updateSkill',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                skill_id: skill_id, 
                skill: skill,
                user_id: user_id
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);

        let tmpSkills = [...this.state.skills];
        let row = {...tmpSkills[rowIdx]};
        row.skill = data;
        tmpSkills[rowIdx] = row;
        this.setState({skills: tmpSkills});

        console.log("Profile.jsx Updated the skill. this.state.skills",this.state.skills);
    }

    createHobby = async(user_id, hobby, rowIdx) => {
        const response = await fetch('http://localhost:5000/createHobby',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                hobby: hobby
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    } 
    // Wait to set state until all promises are fulfilled
    setCreatedHobbies = (createdHobbiesToSet) => {
        console.log("Profile.jsx recieved hobbies to set:", createdHobbiesToSet);
        this.setState({hobbies: [...this.state.hobbies, ...createdHobbiesToSet]});
    }

    createSkill = async(user_id, skill) => {
        const response = await fetch('http://localhost:5000/createSkill',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                skill: skill
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }
    // Wait to set state until all promises are fulfilled
    setCreatedSkills = (createdSkillsToSet) => {
        console.log("Profile.jsx recieved skills to set:", createdSkillsToSet);
        this.setState({skills: [...this.state.skills, ...createdSkillsToSet]});
    }

    deleteHobby = async(hobby_id) => {
        const response = await fetch('http://localhost:5000/deleteHobby',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                hobby_id: hobby_id
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        //return data;
        window.location.reload();
    }

    deleteSkill = async(skill_id) => {
        const response = await fetch('http://localhost:5000/deleteSkill',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                skill_id: skill_id
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        //return data;
        window.location.reload();
    }

    updateEmail = async(user_id, public_email) => {
        const response = await fetch('http://localhost:5000/updatePublicEmail',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id, 
                public_email: public_email
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        
        // Update public_email in state -- create copy and update
        let tmpProfile = [...this.state.profile];
        tmpProfile[0].public_email = data;

        this.setState({
            profile: tmpProfile
        });
        console.log("Profile.jsx Updated Public Email. this.state.profile:", this.state.profile);
    }

    updatePhone = async(user_id, phone) => {
        const response = await fetch('http://localhost:5000/updatePhone',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id, 
                phone: phone
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        
        // Update public_email in state -- create copy and update
        let tmpProfile = [...this.state.profile];
        tmpProfile[0].phone = data;

        this.setState({
            profile: tmpProfile
        });
        console.log("Profile.jsx Updated Public Email. this.state.profile:", this.state.profile);
    }

    createLink = async(user_id, link) =>{
        console.log("[Profile.jsx] Recieved Link:", link);
        const response = await fetch('http://localhost:5000/createLink',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                title: link.title,
                link: link.link,
                description: link.description
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }
    setCreatedLinks = (createdLinksToSet) => {
        console.log("Profile.jsx recieved links to set:", createdLinksToSet);
        this.setState({contact: [...this.state.contact, ...createdLinksToSet]});
    }

    updateLink = async(link_id, link, title, description, user_id, rowIdx) => {
        const response = await fetch('http://localhost:5000/updateLink',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                link_id: link_id, 
                link: link,
                title: title,
                description: description,
                user_id: user_id
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);

        let tmpLinks = [...this.state.contact];
        let row = {...tmpLinks[rowIdx]};
        row = data;
        tmpLinks[rowIdx] = row;
        this.setState({contact: tmpLinks});

        console.log("Profile.jsx Updated the Link. this.state.contact",this.state.contact);
    }

    deleteLink = async(link_id) => {
        const response = await fetch('http://localhost:5000/deleteLink',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                link_id: link_id
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        //return data;
        window.location.reload();
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
                            updateSkill={this.updateSkill}
                            createHobby={this.createHobby}
                            setCreatedHobbies={this.setCreatedHobbies}
                            createSkill={this.createSkill}
                            setCreatedSkills={this.setCreatedSkills}
                            deleteHobby={this.deleteHobby}
                            deleteSkill={this.deleteSkill}
                        />
                    : null }

                    { this.state.key === "portfolio" ?
                        <Portfolio {...this.props} data={this.state}/>
                    : null }

                    { this.state.key === "contact" ?
                        <Contact {...this.props} data={this.state}
                            updateEmail={this.updateEmail}
                            updatePhone={this.updatePhone}
                            createLink={this.createLink}
                            updateLink={this.updateLink}
                            deleteLink={this.deleteLink}
                            setCreatedLinks={this.setCreatedLinks}
                        />
                    : null }
                </div>
            </div>
        );
    }

}

export default Profile;
