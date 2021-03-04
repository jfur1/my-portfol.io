import React, { Component } from 'react';
import { Tabs, Tab, Spinner } from 'react-bootstrap';
import { AlertMsg } from '../components/alerts';

// Import Components
import { NavBar } from './navbar';
import { Home } from './home';
import { About } from './about';
import { Portfolio } from './portfolio';
import { Contact } from './contact';
import { Footer } from './Footer';


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

            about: (typeof this.props.location.about !== 'undefined') ? this.props.location.state.about : [],

            profile: (typeof this.props.location.profile !== 'undefined') ? this.props.location.state.profile : null,

            portfolio: (typeof this.props.location.portfolio !== 'undefined') ? this.props.location.state.portfolio : null,

            contact: (typeof this.props.location.contact !== 'undefined') ? this.props.location.state.contact : null,

            education: (typeof this.props.location.education !== 'undefined') ? this.props.location.state.education : null,

            hobbies: (typeof this.props.location.hobbies !== 'undefined') ? this.props.location.state.hobbies : null,

            skills: (typeof this.props.location.skills !== 'undefined') ? this.props.location.state.skills : null,

            projects: (typeof this.props.location.projects !== 'undefined') ? this.props.location.state.projects : null,

            images: (typeof this.props.location.images !== 'undefined') ? this.props.location.state.images : null,

            font: (typeof this.props.location.font !== 'undefined') ? this.props.location.state.font : null,

            loading: true
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
            'http://localhost:5000/projects',
            'http://localhost:5000/images',
        ];

        let [data, about, profile, portfolio, contact, education, hobbies, skills, projects, images] = await 
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
                        profile: this.state.profile,
                        images: this.state.images
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
                images: images
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
        this.setState({loading: false});
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
                        projects: this.state.projects,
                        images: this.state.images
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
                    projects: this.state.projects,
                    images: this.state.images
                }
            })
        }
    }
    
    // ABOUT Tab
    createLocation = async(user_id, location) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/createLocation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id, 
                location: location
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }
    updateLocation = async (locationToUpdate, user_id) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/updateLocation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id, 
                location: locationToUpdate
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }

    createBio = async(user_id, bio) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/createBio',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id, 
                bio: bio
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }
    updateBio = async(bioToUpdate, user_id) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/updateBio',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id, 
                bio: bioToUpdate
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }
    
    createHobby = async(user_id, hobby, idx) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/createHobby',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                hobby: hobby,
                position: idx
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    } 
    updateHobby = async(hobby_id, hobby, user_id, rowIdx) => {
        this.setState({loading: true});
        console.log("[Profile.jsx] Recieved Position:", rowIdx);
        const response = await fetch('http://localhost:5000/updateHobby',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                hobby_id: hobby_id, 
                hobby: hobby,
                user_id: user_id,
                position: rowIdx
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }
    deleteHobby = async(hobby_id) => {
        this.setState({loading: true});
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
        return data;
    }

    createSkill = async(user_id, skill, idx) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/createSkill',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                skill: skill,
                position: idx
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }
    updateSkill = async(skill_id, skill, user_id, rowIdx) => {
        this.setState({loading: true});
        console.log("[Profile.jsx] Recieved Position:", rowIdx);
        const response = await fetch('http://localhost:5000/updateSkill',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                skill_id: skill_id, 
                skill: skill,
                user_id: user_id,
                position: rowIdx
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }
    deleteSkill = async(skill_id) => {
        this.setState({loading: true});
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
        return data;
    }

    // CONTACT Tab

    updateEmail = async(user_id, public_email) => {
        this.setState({loading: true});
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
        return;
    }

    updatePhone = async(user_id, phone) => {
        this.setState({loading: true});
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
        return;
    }

    createLink = async(user_id, link, idx) =>{
        this.setState({loading: true});
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
                description: link.description,
                position: idx
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }

    updateLink = async(link_id, link, title, description, user_id, rowIdx) => {
        console.log("[Profile.jsx] Recieved Position:", rowIdx);
        this.setState({loading: true});
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
                user_id: user_id,
                position: rowIdx
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }

    deleteLink = async(link_id) => {
        this.setState({loading: true});
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
        return data;
    }

    // PORTFOLIO Tab

    createProject = async(user_id, project, idx) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/createProject',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                title: project.title,
                description: project.description,
                organization: project.organization,
                from_when: project.from_when,
                to_when: project.to_when,
                link: project.link,
                position: idx
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }

    updateProject = async(user_id, project, rowIdx) => {
        this.setState({loading: true});
        //console.log("Profile.jsx Recieved Project:", project)
        const response = await fetch('http://localhost:5000/updateProject',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                project_id: project.project_id, 
                user_id: user_id,
                title: project.title,
                description: project.description,
                organization: project.organization,
                from_when: project.from_when,
                to_when: project.to_when,
                link: project.link,
                position: rowIdx
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    } 
    
    deleteProject = async(project_id) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/deleteProject',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                project_id: project_id
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }

    createWorkExperience = async(user_id, workExperience, idx) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/createWorkExperience',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                occupation: workExperience.occupation,
                organization: workExperience.organization,
                from_when: workExperience.from_when,
                to_when: workExperience.to_when,
                description: workExperience.description,
                position: idx
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }

    updateWorkExperience = async(user_id, workExperience, rowIdx) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/updateWorkExperience',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                portfolio_id: workExperience.portfolio_id, 
                user_id: user_id,
                occupation: workExperience.occupation,
                organization: workExperience.organization,
                from_when: workExperience.from_when,
                to_when: workExperience.to_when,
                description: workExperience.description,
                position: rowIdx
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }

    deleteWorkExperience = async(portfolio_id) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/deleteWorkExperience',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                portfolio_id: portfolio_id
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }

    createEducation = async(user_id, education, idx) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/createEducation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                organization: education.organization,
                education: education.education,
                from_when: education.from_when,
                to_when: education.to_when,
                description: education.description,
                position: idx
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }

    updateEducation = async(user_id, education, rowIdx) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/updateEducation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                education_id: education.education_id, 
                user_id: user_id,
                organization: education.organization,
                education: education.education,
                from_when: education.from_when,
                to_when: education.to_when,
                description: education.description,
                position: rowIdx
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }

    deleteEducation = async(education_id) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/deleteEducation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                education_id: education_id
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }

    // HOME Tab
    updateFullname = async(user_id, fullname) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/updateFullname',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                fullname: fullname
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }

    createCurrentOccupation = async(user_id, occupation) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/createCurrentOccupation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                occupation: occupation
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }

    updateCurrentOccupation = async(user_id, occupation) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/updateCurrentOccupation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                occupation: occupation
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }

    createCurrentOrganization = async(user_id, organization) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/createCurrentOrganization',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                organization: organization
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }

    updateCurrentOrganization = async(user_id, organization) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/updateCurrentOrganization',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                organization: organization
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }
    
    createProfileImages = async(user_id, base64image, base64preview, prefix) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/createProfileImages',  {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                user_id: user_id,
                base64image: base64image,
                base64preview: base64preview,
                prefix: prefix
            })
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }

    updateProfileImages = async(user_id, base64image, base64preview, prefix) => {
        this.setState({loading: true});
        const response = await fetch('http://localhost:5000/updateProfileImages',  {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                user_id: user_id,
                base64image: base64image,
                base64preview: base64preview,
                prefix: prefix
            })
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }

    updatePreviewCoords = async(user_id, x, y, r) => {
        this.setState({loading: true})
        const response = await fetch('http://localhost:5000/updatePreviewCoords',  {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                user_id: user_id,
                x: x,
                y: y,
                radius: r
            })
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }

    updateFont = async(user_id, updatedFont) => {
        this.setState({loading: true})
        console.log("Profile recieved font:", updatedFont)
        const response = await fetch('http://localhost:5000/updateFont',  {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                user_id: user_id,
                font: updatedFont
            })
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }

    updateSize = async(user_id, updatedSize) => {
        this.setState({loading: true})
        console.log("Profile recieved size:", updatedSize)
        const response = await fetch('http://localhost:5000/updateFontSize',  {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                user_id: user_id,
                size: updatedSize
            })
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return;
    }

    render(){

        return(
            <div className="container">
                {this.state.loading
                
                ? <div className="loading-container">
                    <div className="holder">
                        <div className='box'>
                        </div>
                    </div>
                    <div className="holder">
                        <div className='box'>
                        </div>
                    </div>
                    <div className="holder">
                        <div className='box'>
                        </div>
                    </div>
                </div>
                
                : <><NavBar {...this.props} data={this.state}/>
                <div className="tabulation-container" 
                    style={{
                        fontFamily: typeof(this.state.profile[0]) !== 'undefined'
                            ? this.state.profile[0].font : null, 
                        fontSize: typeof(this.state.profile[0]) !== 'undefined'
                            ? this.state.profile[0].font_size : null
                        }}>
                <div className="user-container">
                    <Tabs
                    className="tab-style"
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
                        <Home {...this.props} data={this.state} 
                            updateFullname={this.updateFullname}
                            createCurrentOccupation={this.createCurrentOccupation}
                            updateCurrentOccupation={this.updateCurrentOccupation}
                            createCurrentOrganization={this.createCurrentOrganization}
                            updateCurrentOrganization={this.updateCurrentOrganization}
                            updateEmail={this.updateEmail}
                            updatePhone={this.updatePhone}
                            createLocation={this.createLocation}
                            updateLocation={this.updateLocation}
                            updateFont={this.updateFont}
                            updateSize={this.updateSize}
                            createProfileImages={this.createProfileImages}
                            updateProfileImages={this.updateProfileImages}
                            updatePreviewCoords={this.updatePreviewCoords}
                        />
                    : null }

                    { this.state.key === "about" ?  
                        <About {...this.props} 
                            data={this.state} 
                            createLocation={this.createLocation}
                            updateLocation={this.updateLocation}
                            createBio={this.createBio}
                            updateBio={this.updateBio}
                            updateHobby={this.updateHobby}
                            updateSkill={this.updateSkill}
                            createHobby={this.createHobby}
                            createSkill={this.createSkill}
                            deleteHobby={this.deleteHobby}
                            deleteSkill={this.deleteSkill}
                        />
                    : null } 

                    { this.state.key === "portfolio" ?
                        <Portfolio {...this.props} data={this.state}
                            createProject={this.createProject}
                            updateProject={this.updateProject}
                            deleteProject={this.deleteProject}
                            createWorkExperience={this.createWorkExperience}
                            updateWorkExperience={this.updateWorkExperience}
                            deleteWorkExperience={this.deleteWorkExperience}
                            createEducation={this.createEducation}
                            updateEducation={this.updateEducation}
                            deleteEducation={this.deleteEducation}
                        />
                    : null }

                    { this.state.key === "contact" ?
                        <Contact {...this.props} data={this.state}
                            updateEmail={this.updateEmail}
                            updatePhone={this.updatePhone}
                            createLink={this.createLink}
                            updateLink={this.updateLink}
                            deleteLink={this.deleteLink}
                        />
                    : null }
                </div> 
                <Footer/>
            </div>
            </>}
        </div>
        );
    }

}

export default Profile;
