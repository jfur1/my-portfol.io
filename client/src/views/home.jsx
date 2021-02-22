// Home Tab on a User's Profile
import { useState } from 'react';
import { Modal, Button, Form, Dropdown } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';
import { AlertDismissible } from '../components/alertDismissible';

export const Home = (props) => {
    //console.log("Home Component Recieved Props: ", props);
    const user = props.data.user;
    let profile = (props.data.profile !== null) ? props.data.profile : props.location.state.profile;

    const [show, setShow] = useState(false);
    const [edited, setEdited] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [fullname, setFullname] = useState(user.fullname);
    const [currentOccupation, setCurrentOccupation] = useState(profile[0].current_occupation);
    const [currentOrganization, setCurrentOrganization] = useState(profile[0].current_organization);
    const [font, setFont] = useState("Arial");

    
    // Modal Alert
    const handleShow = () => setShow(true);
    const handleClose = () => {
        if(edited){
            setShowAlert(true);
        } else{
            setShow(false);    
        }
    }
    const discardChanges = () => {
        setFullname(user.fullname);
        setCurrentOccupation(profile.current_occupation);
        setCurrentOrganization(profile.current_organization);
    }

    const handleSave = async() => {

        // Declare Funcation Prototypes
        const updateFullname = async() => {
            await props.updateFullname(user.user_id, fullname);
        }

        const createCurrentOccupation = async() => {
            await props.createCurrentOccupation(user.user_id, currentOccupation);
        }

        const updateCurrentOccupation = async() => {
            await props.updateCurrentOccupation(user.user_id, currentOccupation);
        }

        const createCurrentOrganization = async() => {
            await props.createCurrentOrganization(user.user_id, currentOrganization);
        }

        const updateCurrentOrganization = async() => {
            await props.updateCurrentOrganization(user.user_id, currentOrganization);
        }

        const updateFont = async() => {
            await props.updateFont(font);
        }

        // Conditionally Call Functions
        if(fullname !== user.fullname) await updateFullname();

        if((!typeof(profile.current_occupation) !== 'undefined') && currentOccupation)
            await createCurrentOccupation();
        else if(typeof(profile.current_occupation) !== 'undefined' && currentOccupation)
            await updateCurrentOccupation();

        if((!typeof(profile.current_organization) !== 'undefined') && currentOrganization)
            await createCurrentOrganization();
        else if(typeof(profile.current_organization) !== 'undefined' && currentOrganization)
            await updateCurrentOrganization();

        if(font !== "arial")
            await updateFont();

        window.location.reload();
    }

    return(
        <div className="tab-container"> 
        <Button variant="warning" className="edit-button" onClick={handleShow}>Edit&nbsp;<PencilFill size={25}/></Button>
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="lg"
            centered
            scrollable={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit Homepage
                    <AlertDismissible
                        setShow={setShow}
                        setEdited={setEdited}
                        setShowAlert={setShowAlert}
                        showAlert={showAlert}
                        handleSave={handleSave}
                        discardChanges={discardChanges}
                    />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate onSubmit={handleSave}>
                    
                    <Form.Row className='mt-3'>
                        <Form.Label>
                            Full Name
                        </Form.Label>
                        <input 
                            type="text" 
                            className="form-control" 
                            defaultValue={fullname} 
                            onChange={e => 
                                {    
                                setFullname(e.target.value); 
                                setEdited(true);
                            }}
                        ></input>
                    </Form.Row>
                    <Form.Row className='mt-3'>
                        <Form.Label>
                            Current Occupation
                        </Form.Label>
                        <input 
                            type="text" 
                            className="form-control" 
                            defaultValue={currentOccupation} 
                            onChange={e => 
                                {setCurrentOccupation(e.target.value); 
                                setEdited(true);
                            }}
                        ></input>
                    </Form.Row>
                    <Form.Row className='mt-3'>
                        <Form.Label>
                            Current Organization
                        </Form.Label>
                        <input 
                            type="text" 
                            className="form-control" 
                            defaultValue={currentOrganization} 
                            onChange={e => 
                                {setCurrentOrganization(e.target.value); 
                                setEdited(true);
                            }}
                        ></input>
                    </Form.Row>

                            <br></br>
                    <Dropdown id="collapsible-nav-dropdown">
                        <Dropdown.Toggle className="bg-transparent text-dark" id="dropdown-custom-components">
                        Your font: <b>{font}</b>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onSelect={e => {setFont("Arial");setEdited(true);}} style={{fontFamily: "Arial"}}>Arial</Dropdown.Item>
                            <Dropdown.Item onSelect={e => {setFont("Times New Roman");setEdited(true);}} style={{fontFamily: "Times New Roman"}}>Times New Roman</Dropdown.Item>
                            <Dropdown.Item onSelect={e => {setFont("Helvetica");setEdited(true);}} style={{fontFamily: "Helvetica"}}>Helvetica</Dropdown.Item>
                            <Dropdown.Item onSelect={e => {setFont("Lucida Console");setEdited(true);}} style={{fontFamily: "Lucida Console"}}>Lucida Console</Dropdown.Item>
                            <Dropdown.Item onSelect={e => {setFont("Papyrus");setEdited(true);}} style={{fontFamily: "Papyrus"}}>Papyrus</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Button variant="success" type="submit" className="mt-5">Save Changes</Button>

                </Form>
            </Modal.Body>
        </Modal>
            {(user !== null && typeof user !== 'undefined')
            ? 
                <>
                <h3>{user.fullname}</h3>

                <br></br>

                <p><b>Username:</b> {user.username}</p>
                <p><b>Email: </b>{user.email}</p>

                {profile[0].current_occupation
                ? <p><b>Currently: </b>{profile[0].current_occupation}</p>
                : null}
                {profile[0].current_organization
                    ? <p>at {profile[0].current_organization}</p>
                    : null}
                <br></br>
                </> 

            : null}

        </div>
    )
}