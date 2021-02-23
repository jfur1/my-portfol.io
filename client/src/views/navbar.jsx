import React from 'react';
import { Nav, Navbar, Dropdown } from 'react-bootstrap';
import auth from '../components/auth';

export const NavBar = (props) => {
    //console.log("NavBar Component Recieved Props: ", props);
    const loggedIn = (props.data.loggedIn !== null) ? props.data.loggedIn : false;
    const requestedBy = (typeof props.location.state !== 'undefined' && typeof props.location.state.requestedBy !== 'undefined') ? props.location.state.requestedBy : props.data.requestedBy;
    //const user = (props.data.user !== null) ? props.data.user : null;
    

    return(

        <Navbar sticky="top" style={{background:'rgba(255,255,255,1)'}}>
            <Navbar.Brand href={loggedIn ? `/${requestedBy.username}` : '/'}>
                <img style={{height: "30px"}} src="/mp-new-logo.png" alt="logo"/>
                &nbsp;&nbsp;&nbsp;
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
                <Nav.Item>
                    {loggedIn ?
                    <Dropdown id="collapsible-nav-dropdown">
                        <Dropdown.Toggle className="bg-transparent text-dark" id="dropdown-custom-components">
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
                    <div className="order"><Nav.Link onClick={() => {props.history.push("/");
                        }}>Login</Nav.Link><p className="my-bar"></p>
                    <Nav.Link onClick={() => {props.history.push("/");
                        }}>Register</Nav.Link></div>
                    }
                </Nav.Item>
            </Navbar.Collapse>
        </Navbar>
    )


}