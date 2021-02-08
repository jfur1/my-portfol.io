import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap'

// Import Components
import { NavBar } from './navbar';

class EditProfile extends Component{
    constructor(props){
        super(props);
        this.state = null;
    }

    componentDidMount(){
        this.setState(this.props.location.state);
    }


    render(){
        console.log("Edit Profile has PROPS:", this.props);
        console.log("edit Profile has STATE:", this.state);
        return(
            <div className="container">
                <NavBar {...this.props} data={this.state}/>
                {alert}


            </div>
        );
    }
}

export default EditProfile;