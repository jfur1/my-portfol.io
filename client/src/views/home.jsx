// Home Tab on a User's Profile
import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';
import { AlertDismissible } from '../components/alertDismissible';
import UploadProfilePicture from './uploadProfilePic'

export const Home = (props) => {
    //console.log("Home Component Recieved Props: ", props);
    const user = props.data.user;
    let profile = (props.data.profile !== null) ? props.data.profile : props.location.state.profile;
    const images = (props.data.images !== null) ? props.data.images : props.location.state.images;

    const [show, setShow] = useState(false);
    const [edited, setEdited] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [fullname, setFullname] = useState(user.fullname);
    const [currentOccupation, setCurrentOccupation] = useState(profile[0].current_occupation);
    const [currentOrganization, setCurrentOrganization] = useState(profile[0].current_organization);

    const [profilePic, setProfilePic] = useState("");
    const [profileAvatar, setProfileAvatar] = useState("");
    const [prefix, setPrefix] = useState("");

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
        setProfilePic('');
        setProfileAvatar('');
    }

    const stageImage = (fullImage) => {
        //console.log("Recieved Full Base64 Img:", fullImage);
        setProfilePic(fullImage.substring(fullImage.indexOf(',')+1));
        setPrefix(fullImage.substring(0, fullImage.indexOf(',')+1));
    }
    const stagePreview = (preview) => {
        //console.log("Recieved Base64 Preview:", preview);
        setProfileAvatar(preview.substring(preview.indexOf(',')+1));
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

        const createProfileImages = async() => {
            await props.createProfileImages(user.user_id, profilePic, profileAvatar, prefix)
        }

        const updateProfileImages = async() => {
            await props.updateProfileImages(user.user_id, profilePic, profileAvatar, prefix)
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

        // Create Profile Picture
        if(typeof(images[0]) == 'undefined' && (profileAvatar || profilePic)){
            await createProfileImages();
        }
        else if(profilePic !== images[0].base64image || profileAvatar !== images[0].base64preview){
            await updateProfileImages();
        }

        window.location.reload();
    }

    function base64src(prefix, data){
        var image = btoa(String.fromCharCode.apply(null, data));
        return prefix+image;
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

                    <Form.Row className='mt-3'>
                        <Form.Label>
                            Profile Picture
                        </Form.Label>
                        <UploadProfilePicture 
                            stagePreview={stagePreview}
                            stageImage={stageImage}
                            src={typeof(images[0]) !== 'undefined'
                            ? `${base64src(images[0].prefix, images[0].base64preview.data)}` 
                            : null}
                        />
                    </Form.Row>
                    <Button variant="success" type="submit" className="mt-5">Save Changes</Button>

                </Form>
            </Modal.Body>
        </Modal>
            {(user !== null && typeof user !== 'undefined')
            ? 
                <>
                <h3>{user.fullname}</h3>

                <h4>Profile Picture:</h4>
                <img src={typeof(images[0]) !== 'undefined'
                    ? `${base64src(images[0].prefix, images[0].base64preview.data)}` 
                    : ''} />

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