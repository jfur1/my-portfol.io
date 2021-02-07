import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap'

// Import Components
import { NavBar } from './navbar';

class EditProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.user !== 'undefined') ? this.props.location.state.user : null,
            
            key: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.key !== 'undefined') ? this.props.location.state.key : "home",
            
            alert: null,

            loggedIn: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.loggedIn !== 'undefined') ? this.props.location.state.loggedIn : false,

            requestedBy: (typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.requestedBy !== 'undefined') ? this.props.location.state.requestedBy : null,
        }
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
                        <Tab eventKey="home" title="Edit Home" />
                        <Tab eventKey="about" title="Edit About" />
                        <Tab eventKey="portfolio" title="Edit Portfolio" />
                        <Tab eventKey="contact" title="Edit Contact" />
                    </Tabs>
                </div>
                {/*Should we make separate edit components and with get and post requests?*/}
                <div className="info-container">
                    { this.state.key === "home" ? 
                    <div className="profile-container">
                        <p>Edit Home container</p>
                    </div> : null }

                    { this.state.key === "about" ?  
                    <div className="resume-container">
                        <p>Edit About container</p>
                    </div> : null}

                    { this.state.key === "portfolio" ?
                    <div className="resume-container">
                        <p>Edit Portfolio Container</p>
                    </div> : null}

                    { this.state.key === "contact" ?
                    <div className="resume-container">
                        <p>Edit Contact Container</p>
                    </div> : null}
                </div>
            </div>
        );
    }
}

export default EditProfile;