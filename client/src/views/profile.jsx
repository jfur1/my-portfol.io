import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
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

            images: (typeof this.props.location.images !== 'undefined') ? this.props.location.state.images : null,

            font: (typeof this.props.location.font !== 'undefined') ? this.props.location.state.font : null,

            loading: true
        }
    }

    // GET profile data, then determine if the user owns this profile
    async componentDidMount(){

        var pathname = window.location.pathname.substr(1, window.location.pathname.length);
        
        const urls = [
            '/getUserData',
            '/about',
            '/profile',
            '/portfolio',
            '/contact',
            '/education',
            '/hobbies',
            '/skills',
            '/projects',
            '/images',
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

        // No profile found
        if((typeof data !== 'undefined') && data["error"]){
            // If not signed in, redirect to splash page
            if(!(typeof data.requestedBy !== 'undefined')){
                return this.props.history.push({
                    pathname: '/',
                    errorMsg: (pathname !== "dashboard") ? `Unable to locate user: ${pathname}` : null,
                })
            } 
            // If signed in, redirect back to users profile
            else{
                this.props.history.push({
                    pathname: `/${data.requestedBy.username}`,
                    errorMsg: `Unable to locate user: ${pathname}`,
                    state: {
                        user: data.requestedBy,
                        key: this.state.key,
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
        if(typeof this.props.location.state !== 'undefined'){
            if(this.state.key !== this.props.location.state.key){
                console.log("Saving a new Key: ", this.state.key);
                const tmpState = {...this.props.location.state};
                tmpState['key'] = this.state.key;
                tmpState['user'] = this.state.user;
                tmpState['requestedBy'] = this.state.requestedBy;
                this.props.history.replace({
                    pathname: `/${this.state.user.username}`,
                    state: tmpState
                })
            }
        } 
        else if(this.state.user.username === 'undefined'){
            this.props.history.push({
                pathname: '/',
                errorMsg: `Unable to locate user: ${window.location.pathname.substr(1, window.location.pathname.length)}`
            })
        }
        else{
            const tmpState = {...this.props.location.state};
            tmpState['key'] = this.state.key;
            tmpState['user'] = this.state.user;
            tmpState['requestedBy'] = this.state.requestedBy;
            this.props.history.push({
                pathname: `/${this.state.user.username}`,
                state: {...this.props.location.state}
            })
        }
    }
    
    // ABOUT Tab
    updateLocation = async (locationToUpdate, user_id) => {
        this.setState({loading: true});
        const response = await fetch('/updateLocation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id, 
                location: locationToUpdate
            })
        });
        await response.json();
        return;
    }

    updateBio = async(bioToUpdate, user_id) => {
        this.setState({loading: true});
        const response = await fetch('/updateBio',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id, 
                bio: bioToUpdate
            })
        });
        await response.json();
        return;
    }
    
    createHobby = async(user_id, hobby, idx) => {
        this.setState({loading: true});
        const response = await fetch('/createHobby',  {
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
        await response.json();
        return;
    } 
    updateHobby = async(hobby_id, hobby, user_id, rowIdx) => {
        this.setState({loading: true});
        console.log("[Profile.jsx] Recieved Position:", rowIdx);
        const response = await fetch('/updateHobby',  {
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
        await response.json();
        return;
    }
    deleteHobby = async(hobby_id) => {
        this.setState({loading: true});
        const response = await fetch('/deleteHobby',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                hobby_id: hobby_id
            }
        });
        await response.json();
        return;
    }

    createSkill = async(user_id, skill, idx) => {
        this.setState({loading: true});
        const response = await fetch('/createSkill',  {
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
        await response.json();
        return;
    }
    updateSkill = async(skill_id, skill, user_id, rowIdx) => {
        this.setState({loading: true});
        console.log("[Profile.jsx] Recieved Position:", rowIdx);
        const response = await fetch('/updateSkill',  {
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
        const response = await fetch('/deleteSkill',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                skill_id: skill_id
            }
        });
        await response.json();
        return;
    }

    // CONTACT Tab
    updateEmail = async(user_id, public_email) => {
        this.setState({loading: true});
        const response = await fetch('/updatePublicEmail',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id, 
                public_email: public_email
            }
        });
        await response.json();
        return;
    }

    updatePhone = async(user_id, phone) => {
        this.setState({loading: true});
        const response = await fetch('/updatePhone',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id, 
                phone: phone
            }
        });
        await response.json();
        return;
    }

    createLink = async(user_id, linkObj, idx) =>{
        this.setState({loading: true});
        const response = await fetch('/createLink',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                linkObj: linkObj,
                position: idx
            })
        });
        await response.json();
        return;
    }

    updateLink = async(linkObj, user_id, rowIdx) => {
        this.setState({loading: true});
        const response = await fetch('/updateLink',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                linkObj: linkObj,
                user_id: user_id,
                position: rowIdx
            })
        });
        await response.json();
        return;
    }

    deleteLink = async(link_id) => {
        this.setState({loading: true});
        const response = await fetch('/deleteLink',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                link_id: link_id
            }
        });
        await response.json();
        return;
    }

    // PORTFOLIO Tab

    createProject = async(user_id, project, idx) => {
        this.setState({loading: true});
        const response = await fetch('/createProject',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                title: project.title,
                description: project.description,
                organization: project.organization,
                from_when: project.from_when,
                to_when: project.to_when,
                link: project.link,
                position: idx
            })
        });
        await response.json();
        return;
    }

    updateProject = async(user_id, project, rowIdx) => {
        this.setState({loading: true});
        const response = await fetch('/updateProject',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                project_id: project.project_id, 
                user_id: user_id,
                title: project.title,
                description: project.description,
                organization: project.organization,
                from_when: project.from_when,
                to_when: project.to_when,
                link: project.link,
                position: rowIdx
            })
        });
        await response.json();
        return;
    } 
    
    deleteProject = async(project_id) => {
        this.setState({loading: true});
        const response = await fetch('/deleteProject',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                project_id: project_id
            }
        });
        await response.json();
        return;
    }

    createWorkExperience = async(user_id, workExperience, idx) => {
        this.setState({loading: true});
        const response = await fetch('/createWorkExperience',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                occupation: workExperience.occupation,
                organization: workExperience.organization,
                from_when: workExperience.from_when,
                to_when: workExperience.to_when,
                description: workExperience.description,
                position: idx
            })
        });
        await response.json();
        return;
    }

    updateWorkExperience = async(user_id, workExperience, rowIdx) => {
        this.setState({loading: true});
        const response = await fetch('/updateWorkExperience',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                portfolio_id: workExperience.portfolio_id, 
                user_id: user_id,
                occupation: workExperience.occupation,
                organization: workExperience.organization,
                from_when: workExperience.from_when,
                to_when: workExperience.to_when,
                description: workExperience.description,
                position: rowIdx
            })
        });
        await response.json();
        return;
    }

    deleteWorkExperience = async(portfolio_id) => {
        this.setState({loading: true});
        const response = await fetch('/deleteWorkExperience',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                portfolio_id: portfolio_id
            }
        });
        await response.json();
        return;
    }

    createEducation = async(user_id, education, idx) => {
        this.setState({loading: true});
        const response = await fetch('/createEducation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                organization: education.organization,
                education: education.education,
                from_when: education.from_when,
                to_when: education.to_when,
                description: education.description,
                position: idx
            })
        });
        await response.json();
        return;
    }

    updateEducation = async(user_id, education, rowIdx) => {
        this.setState({loading: true});
        const response = await fetch('/updateEducation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                education_id: education.education_id, 
                user_id: user_id,
                organization: education.organization,
                education: education.education,
                from_when: education.from_when,
                to_when: education.to_when,
                description: education.description,
                position: rowIdx
            })
        });
        await response.json();
        return;
    }

    deleteEducation = async(education_id) => {
        this.setState({loading: true});
        const response = await fetch('/deleteEducation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                education_id: education_id
            }
        });
        await response.json();
        return;
    }

    // HOME Tab
    updateFullname = async(user_id, fullname) => {
        this.setState({loading: true});
        const response = await fetch('/updateFullname',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                fullname: fullname
            }
        });
        await response.json();
        return;
    }

    createCurrentOccupation = async(user_id, occupation) => {
        this.setState({loading: true});
        const response = await fetch('/createCurrentOccupation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                occupation: occupation
            }
        });
        await response.json();
        return;
    }

    updateCurrentOccupation = async(user_id, occupation) => {
        this.setState({loading: true});
        const response = await fetch('/updateCurrentOccupation',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                occupation: occupation
            }
        });
        await response.json();
        return;
    }

    createCurrentOrganization = async(user_id, organization) => {
        this.setState({loading: true});
        const response = await fetch('/createCurrentOrganization',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                organization: organization
            }
        });
        await response.json();
        return;
    }

    updateCurrentOrganization = async(user_id, organization) => {
        this.setState({loading: true});
        const response = await fetch('/updateCurrentOrganization',  {
            method: 'POST', 
            mode: 'cors',
            credentials: 'include',
            withCredentials: true,
            headers: {
                user_id: user_id,
                organization: organization
            }
        });
        await response.json();
        return;
    }
    
    createProfileImages = async(user_id, base64image, base64preview, prefix) => {
        this.setState({loading: true});
        const response = await fetch('/createProfileImages',  {
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
        await response.json();
        return;
    }

    updateProfileImages = async(user_id, base64image, base64preview, prefix) => {
        this.setState({loading: true});
        const response = await fetch('/updateProfileImages',  {
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
        await response.json();
        return;
    }

    updatePreviewCoords = async(user_id, x, y, r) => {
        this.setState({loading: true})
        const response = await fetch('/updatePreviewCoords',  {
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
        await response.json();
        return;
    }

    updateFont = async(user_id, updatedFont) => {
        this.setState({loading: true})
        console.log("Profile recieved font:", updatedFont)
        const response = await fetch('/updateFont',  {
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
        await response.json();
        return;
    }

    updateSize = async(user_id, updatedSize) => {
        this.setState({loading: true})
        console.log("Profile recieved size:", updatedSize)
        const response = await fetch('/updateFontSize',  {
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
        await response.json();
        return;
    }

    render(){

        return(
            <div className="profile-container">

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
                        fontFamily: this.state.profile && this.state.profile[0]
                            ? this.state.profile[0].font : null, 
                        fontSize: this.state.profile && this.state.profile[0]
                            ? this.state.profile[0].font_size : null
                        }}>
                <div className="user-tab-container">
                    <Tabs
                    className="tab-style mt-4"
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
                            updateLocation={this.updateLocation}
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
            </div>
            </>}
        </div>
        );
    }

}

export default Profile;
