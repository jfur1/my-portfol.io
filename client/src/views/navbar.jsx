import React from 'react';
import { Nav, Navbar, Dropdown } from 'react-bootstrap';
import auth from '../components/auth';

export const NavBar = (props) => {
    //console.log("NavBar Component Recieved Props: ", props);
    const loggedIn = (props.data.loggedIn !== null) ? props.data.loggedIn : false;
    const requestedBy = (typeof(props.data.requestedBy) !== 'undefined') ? props.data.requestedBy : null;
    

    return(

        <Navbar sticky="top" collapseOnSelect expand="lg" style={{background:'rgba(255,255,255,1)'}}>
            {/* <Navbar.Brand onClick={() => {
                requestedBy
                ? this.props.history.push(`/${requestedBy.username}`)
                : this.props.history.push('/')
            }}> */}
            <Navbar.Brand href={loggedIn ? `/${requestedBy.username}` : '/'}>
                <img style={{height: "30px"}} src="/mp-new-logo.png" alt="logo"/>
                &nbsp;&nbsp;&nbsp;
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
                <Nav.Item>
                    {loggedIn ?
                    <Dropdown id="collapsible-nav-dropdown">
                        <Dropdown.Toggle 
                            className="bg-transparent text-dark" 
                            id="dropdown-custom-components"
                        >
                            Signed in as: <b>{requestedBy.fullname}</b>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Nav.Link onClick={() => {
                                    auth.logout(() => {
                                        props.history.push({
                                            pathname:"/",
                                            state: {loggedOut: true}
                                     });
                                    });
                                }}>Logout</Nav.Link>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    :                              
                    <Nav.Link onClick={() => {props.history.push("/");}}>Login or Register</Nav.Link>
                    }
                </Nav.Item>
            </Navbar.Collapse>
        </Navbar>
    )


}