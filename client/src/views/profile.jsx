import React, { Component } from 'react';
import { Tabs, Tab, Spinner } from 'react-bootstrap'
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

            about: (typeof this.props.location.about !== 'undefined') ? this.props.location.state.about : [],

            profile: (typeof this.props.location.profile !== 'undefined') ? this.props.location.state.profile : null,

            portfolio: (typeof this.props.location.portfolio !== 'undefined') ? this.props.location.state.portfolio : null,

            contact: (typeof this.props.location.contact !== 'undefined') ? this.props.location.state.contact : null,

            education: (typeof this.props.location.education !== 'undefined') ? this.props.location.state.education : null,

            hobbies: (typeof this.props.location.hobbies !== 'undefined') ? this.props.location.state.hobbies : null,

            skills: (typeof this.props.location.skills !== 'undefined') ? this.props.location.state.skills : null,

            projects: (typeof this.props.location.projects !== 'undefined') ? this.props.location.state.projects : null,

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
        this.setState({
            about: {
                ...this.state.about,
                location: data,
            },
            loading: false
        });
        console.log("Profile.jsx Created Location. this.state.about:", this.state.about);
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
        this.setState({
            about: {
                ...this.state.about,
                location: data,
            },
            loading: false
        });
        console.log("Profile.jsx Updated Location. this.state.about:",this.state.about);
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
        this.setState({
            about: {
                ...this.state.about,
                bio: data,
            },
            loading: false
        });
        console.log("Profile.jsx Created Bio. this.state.about:", this.state.about);
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
        this.setState({
            about: {
                ...this.state.about,
                bio: data,
            },
            loading: false
        });
        console.log("Profile.jsx Updated Bio. this.state.about:", this.state.about);
    }
    
    updateHobby = async(hobby_id, hobby, user_id, rowIdx) => {
        this.setState({loading: true});
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
        this.setState({hobbies: tmpHobbies, loading: false});

        console.log("Profile.jsx Updated the hobby. this.state.hobbies:",this.state.hobbies);
    }

    updateSkill = async(skill_id, skill, user_id, rowIdx) => {
        this.setState({loading: true});
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
        this.setState({skills: tmpSkills, loading: false});

        console.log("Profile.jsx Updated the skill. this.state.skills",this.state.skills);
    }

    createHobby = async(user_id, hobby, rowIdx) => {
        this.setState({loading: true});
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
        this.setState({
            hobbies: [...this.state.hobbies, ...createdHobbiesToSet],
            loading: false
        });
    }

    createSkill = async(user_id, skill) => {
        this.setState({loading: true});
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
        this.setState({
            skills: [...this.state.skills, ...createdSkillsToSet],
            loading: false});
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
        
        // Update public_email in state -- create copy and update
        let tmpProfile = [...this.state.profile];
        tmpProfile[0].public_email = data;

        this.setState({
            profile: tmpProfile,
            loading: false
        });
        console.log("Profile.jsx Updated Public Email. this.state.profile:", this.state.profile);
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
        
        // Update public_email in state -- create copy and update
        let tmpProfile = [...this.state.profile];
        tmpProfile[0].phone = data;

        this.setState({
            profile: tmpProfile,
            loading: false
        });
        console.log("Profile.jsx Updated Public Email. this.state.profile:", this.state.profile);
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
        return data;
    }
    setCreatedLinks = (createdLinksToSet) => {
        console.log("Profile.jsx recieved links to set:", createdLinksToSet);
        this.setState({
            contact: [...this.state.contact, ...createdLinksToSet],
            loading: false
        });
    }

    updateLink = async(link_id, link, title, description, user_id, rowIdx) => {
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

        // let tmpLinks = [...this.state.contact];
        // tmpLinks[rowIdx] = data;
        // this.setState({contact: tmpLinks, loading: false});


        //console.log("Profile.jsx Updated the Link. this.state.contact",this.state.contact);
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

    // This will work while user is signed in, but no way around saving ordering in the DB -- hooks will be reset upon logout
    
    // setReorderedLinks = (reorderedLinks) => {
    //     console.log("[Profile.jsx] Recieved reordered links:", reorderedLinks);
    //     this.props.history.push({
    //         pathname: `/${this.state.user.username}`,
    //         state: {
    //             user: this.state.user,
    //             key: this.state.key,
    //             ownedByUser: this.state.ownedByUser,
    //             loggedIn: this.state.loggedIn,
    //             requestedBy: this.state.requestedBy,
    //             about: this.state.about,
    //             profile: this.state.profile,
    //             portfolio: this.state.portfolio,
    //             contact: reorderedLinks,
    //             education: this.state.education,
    //             hobbies: this.state.hobbies,
    //             skills: this.state.skills,
    //             projects: this.state.projects
    //         }
    //     })
    //     this.setState({contact: reorderedLinks, loading: false})
    // }

    // PORTFOLIO Tab

    createProject = async(user_id, project) => {
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
                link: project.link
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }
    setCreatedProjects = (createdProjectsToSet) => {
        console.log("Profile.jsx recieved projects to set:", createdProjectsToSet);
        this.setState({
            projects: [...this.state.projects, ...createdProjectsToSet],
            loading: false
        });
    }

    updateProject = async(user_id, project, rowIdx) => {
        this.setState({loading: true});
        console.log("Profile.jsx Recieved Project:", project)
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
                link: project.link
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);

        let tmpProjects = [...this.state.projects];
        tmpProjects[rowIdx] = data;
        this.setState({projects: tmpProjects, loading: false});
        console.log("Profile.jsx Updated the Link. this.state.projects",this.state.projects);
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

    createWorkExperience = async(user_id, workExperience) => {
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
                description: workExperience.description
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }
    setCreatedWorkExperience = (createdWorkExperienceToSet) => {
        console.log("Profile.jsx recieved Work to set:", createdWorkExperienceToSet);
        this.setState({
            portfolio: [...this.state.portfolio, ...createdWorkExperienceToSet],
            loading: false
        });
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
                description: workExperience.description
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);

        let tmpPortfolio = [...this.state.portfolio];
        tmpPortfolio[rowIdx] = data;
        this.setState({portfolio: tmpPortfolio, loading: false});
        console.log("Profile.jsx Updated the portfolio. this.state.portfolio",this.state.portfolio);
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

    createEducation = async(user_id, education) => {
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
                description: education.description
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);
        return data;
    }
    setCreatedEducation = async(createdEducationToSet) => {
        console.log("Profile.jsx recieved education to set:", createdEducationToSet);
        this.setState({
            education: [...this.state.education, ...createdEducationToSet],
            loading: false
        });
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
                description: education.description
            }
        });
        const data = await response.json();
        console.log("Client Recieved Response: ", data);

        let tmpEducation = [...this.state.education];
        tmpEducation[rowIdx] = data;
        this.setState({education: tmpEducation, loading: false});
        console.log("Profile.jsx Updated the education. this.state.education",this.state.education);
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

    reloadProfile = () => {
        window.location.reload();
    }

    render(){

        return(
            <div className="container">
                {this.state.loading
                
                ? <><Spinner animation="border" variant="success" /></>
                
                : <><NavBar {...this.props} data={this.state}/>
                
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
                            createLocation={this.createLocation}
                            updateLocation={this.updateLocation}
                            createBio={this.createBio}
                            updateBio={this.updateBio}
                            updateHobby={this.updateHobby}
                            updateSkill={this.updateSkill}
                            createHobby={this.createHobby}
                            setCreatedHobbies={this.setCreatedHobbies}
                            createSkill={this.createSkill}
                            setCreatedSkills={this.setCreatedSkills}
                            deleteHobby={this.deleteHobby}
                            deleteSkill={this.deleteSkill}
                            reloadProfile={this.reloadProfile}
                        />
                    : null }

                    { this.state.key === "portfolio" ?
                        <Portfolio {...this.props} data={this.state}
                            createProject={this.createProject}
                            setCreatedProjects={this.setCreatedProjects}
                            updateProject={this.updateProject}
                            deleteProject={this.deleteProject}
                            createWorkExperience={this.createWorkExperience}
                            setCreatedWorkExperience={this.setCreatedWorkExperience}
                            updateWorkExperience={this.updateWorkExperience}
                            deleteWorkExperience={this.deleteWorkExperience}
                            createEducation={this.createEducation}
                            setCreatedEducation={this.setCreatedEducation}
                            updateEducation={this.updateEducation}
                            deleteEducation={this.deleteEducation}
                            reloadProfile={this.reloadProfile}
                        />
                    : null }

                    { this.state.key === "contact" ?
                        <Contact {...this.props} data={this.state}
                            updateEmail={this.updateEmail}
                            updatePhone={this.updatePhone}
                            createLink={this.createLink}
                            updateLink={this.updateLink}
                            deleteLink={this.deleteLink}
                            setCreatedLinks={this.setCreatedLinks}
                            reloadProfile={this.reloadProfile}
                            setReorderedLinks={this.setReorderedLinks}
                        />
                    : null }
                </div> 
                </>}
            </div>
        );
    }

}

export default Profile;
