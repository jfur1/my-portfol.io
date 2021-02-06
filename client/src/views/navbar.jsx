import React, { useState } from 'react';
import { Nav, Navbar, Dropdown } from 'react-bootstrap'
import { PersonCircle } from 'react-bootstrap-icons';
import auth from '../components/auth';

export const NavBar = (props) => {
    console.log("NavBar Component Recieved Props: ", props);
    const loggedIn = (props.data.loggedIn !== null) ? props.data.loggedIn : false;
    const requestedBy = (props.data.requestedBy !== null) ? props.data.requestedBy : null;


    return(

        <Navbar>
            <Navbar.Brand href="/dashboard"><img style={{height: "30px"}} src="/mp-new-logo-beta.png" alt="logo"/></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
            {loggedIn ? 
                <Nav.Item>
                    <Navbar.Text className="mr-sm-2">
                        Signed in as: <b>{requestedBy.first_name} {requestedBy.last_name}</b>
                    </Navbar.Text>
                </Nav.Item>
                : null}
                <Nav.Item>
                    <Dropdown id="collapsible-nav-dropdown">
                        <Dropdown.Toggle className="bg-transparent text-dark" id="dropdown-custom-components">
                            <PersonCircle size={50}/>
                        </Dropdown.Toggle>
                        {loggedIn ?
                        <Dropdown.Menu>
                            <Dropdown.Item><Nav.Link>Edit Profile</Nav.Link></Dropdown.Item>
                            <Dropdown.Item>
                                <Nav.Link onClick={() => {
                                    auth.logout(() => {
                                        props.history.push({
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
                            <Nav.Link onClick={() => {props.history.push("/login");
                            }}>Login</Nav.Link>
                            </Dropdown.Item>
                        </Dropdown.Menu>  }
                    </Dropdown>
                </Nav.Item>
                
            </Navbar.Collapse>
        </Navbar>
    )


}