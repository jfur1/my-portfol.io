// Home Tab on a User's Profile
import { useState } from 'react';
import { Modal, Button, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';
import { AlertDismissible } from '../components/alertDismissible';
import UploadProfilePicture from './uploadProfilePic';
import Switch  from '../components/switch';

export const Home = (props) => {
    //console.log("Home Component Recieved Props: ", props);
    const user = props.data.user;
    const profile = (props.data.profile !== null) ? props.data.profile : props.location.state.profile;
    const images = (props.data.images !== null) ? props.data.images : props.location.state.images;

    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [edited, setEdited] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [fullname, setFullname] = useState(user.fullname);
    const [currentOccupation, setCurrentOccupation] 
    = useState(
        typeof(profile[0]) !== 'undefined' 
            ? profile[0].current_occupation 
            : null
    );
    const [currentOrganization, setCurrentOrganization] 
    = useState(
        typeof(profile[0]) !== 'undefined' 
            ? profile[0].current_organization 
            : null
    );
    const [font, setFont] = useState(typeof(profile[0]) !== 'undefined' ? profile[0].font : null);
    const [size, setSize] = useState(typeof(profile[0]) !== 'undefined' && !profile[0].font_size ? profile[0].font_size : "100%");
    const [showEditPic, setShowEditPic] = useState(false);
    const [x, setX] = useState(typeof(images[0]) !== 'undefined' ? images[0].x : null);
    const [y, setY] = useState(typeof(images[0]) !== 'undefined' ? images[0].y : null);
    const [r, setR] = useState(typeof(images[0]) !== 'undefined' ? images[0].radius : null)

    const [profilePic, setProfilePic] 
    = useState(
        typeof(images[0]) !== 'undefined' && typeof(images[0].base64image) !== 'undefined'
            ? binaryToBase64(images[0].base64image.data) 
            : ""
    );
    
    const [profileAvatar, setProfileAvatar] 
    = useState(
        typeof(images[0]) !== 'undefined' && typeof(images[0].base64preview) !== 'undefined'
            ? binaryToBase64(images[0].base64preview.data) 
            : ""
    );
    
    const [prefix, setPrefix] 
    = useState(
        typeof(images[0]) !== 'undefined' && typeof(images[0].prefix) !== 'undefined'
            ? images[0].prefix 
            : ""
    );

    // Modal Alert
    const handleShow = () => setShow(true);
    const handleClose = () => {
        if(edited){
            setShowAlert(true);
        } else{
            setShow(false);
            setShowEditPic(false);
        }
    }
    const discardChanges = () => {
        setFullname(user.fullname);
        setCurrentOccupation(typeof(profile[0]) !== 'undefined' ? profile[0].current_occupation : null);
        setCurrentOrganization(typeof(profile[0]) !== 'undefined' ? profile[0].current_organization : null);
        setX(typeof(images[0]) !== 'undefined' ? images[0].x : null);
        setY(typeof(images[0]) !== 'undefined' ? images[0].y : null);
        setR(typeof(images[0]) !== 'undefined' ? images[0].radius : null);
        setShowEditPic(false);
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

    const stageCoords = (x, y, r) => {
        //console.log("Home tab recieved crop coords:");
        //console.log("(x: " + x ,", y: " + y + ", Radius: ", + r + ")");
        setX(x); setY(y); setR(r);
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

        const updateFont = async() => {
            await props.updateFont(user.user_id, font);
        }

        const updateSize = async() => {
            await props.updateSize(user.user_id, size);
        }

        const updatePreviewCoords = async() => {
            await props.updatePreviewCoords(user.user_id, x, y, r);
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

        if(font !== null)
            await updateFont();
        
        if(size !== null)
            await updateSize();
            
        // Create Profile Picture
        if(typeof(images[0]) == 'undefined' && (profileAvatar || profilePic)){
            await createProfileImages();
        }
        else if(profilePic !== images[0].base64image || profileAvatar !== images[0].base64preview){
            await updateProfileImages();
        }
        if(typeof(images[0]) !== 'undefined' && ((images[0].x !== x && x) || (images[0].y !== y && y))){
            await updatePreviewCoords();
        }


        window.location.reload();
    }

    function binaryToBase64(data){
        var image = btoa(new Uint8Array(data).reduce(function (tmp, byte) {
            return tmp + String.fromCharCode(byte);
        }, ''));
        return image;
    }

    const confirmDelete = () => {
        return(
            <>
            <Modal
                show={showDelete}
                onHide={() => setShowDelete(false)}
                backdrop="static"
                keyboard={false}
                size="sm"
                centered
                scrollable={false}
            >
            <Modal.Dialog>
                <Modal.Body>
                    <p>Are you sure you want to remove your current avatar?</p>
                </Modal.Body>
            </Modal.Dialog>
            <Modal.Footer>
                <Button variant="secondary">Cancel</Button>
                <Button variant="danger">OK</Button>
            </Modal.Footer>
            </Modal>
            </>
        );
    }

    return(
        <div className="tab-container"> 
        {props.data.ownedByUser 
        ? <Button variant="warning" className="edit-button" onClick={handleShow}>Edit&nbsp;<PencilFill size={25}/></Button>
        : null}
        
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
                            style={{textAlign:"left"}}
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
                            style={{textAlign:"left"}}
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
                            style={{textAlign:"left"}}
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
                            Edit Profile Picture
                        </Form.Label>
                    </Form.Row>

                    <Form.Row className='justify-content-center'>
                        {showEditPic 
                        ? <UploadProfilePicture 
                            stagePreview={stagePreview}
                            stageImage={stageImage}
                            stageCoords={stageCoords}
                            x={x}
                            y={y}
                            r={r}
                        />
                        : <img src={typeof(images[0]) !== 'undefined'
                            ? prefix + profileAvatar
                            : ''} alt="Preview"/>}
                        
                        {showDelete
                            ? <Modal
                                show={showDelete}
                                onHide={() => setShowDelete(false)}
                                backdrop="static"
                                keyboard={false}
                                size="sm"
                                centered
                                scrollable={false}
                            >
                            <Modal.Header closeButton>
                            <Modal.Title>Modal title</Modal.Title>
                            </Modal.Header>
                                <Modal.Body>
                                    <p>Are you sure you want to remove your current avatar?</p>
                                </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
                                <Button variant="danger" 
                                    onClick={() => {
                                        setProfileAvatar('');
                                        setProfilePic('');
                                        setEdited(true);
                                        setShowDelete(false);
                                    }}>    
                                OK</Button>
                            </Modal.Footer>
                            </Modal>
                        :null}

                        {!showEditPic
                        ? <DropdownButton id="avatar-dropdown" title="edit" size="sm">
                            <Dropdown.Item eventKey="1" 
                                onClick={() => {setShowEditPic(!showEditPic);setEdited(true);}}>
                                Upload a photo...
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={() => setShowDelete(true)}>Remove Photo</Dropdown.Item>
                        </DropdownButton>
                        : null}
                    </Form.Row>

                    <br></br>
                    <Form.Row className='mt-3'>
                        <Form.Label>
                            Edit Font
                        </Form.Label>
                    </Form.Row>
                    <Dropdown id="collapsible-nav-dropdown">
                        <Dropdown.Toggle className="bg-transparent text-dark" id="dropdown-custom-components">
                        Your font: <b style={{
                            fontFamily: font
                        }}>{!font ? "Arial" : font}</b>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item active={(font === "Arial") ? true : false} onSelect={e => {setFont("Arial");setEdited(true);}} style={{fontFamily: "Arial"}}>Arial</Dropdown.Item>
                            <Dropdown.Item active={(font === "Times New Roman") ? true : false} onSelect={e => {setFont("Times New Roman");setEdited(true);}} style={{fontFamily: "Times New Roman"}}>Times New Roman</Dropdown.Item>
                            <Dropdown.Item active={(font === "Helvetica") ? true : false} onSelect={e => {setFont("Helvetica");setEdited(true);}} style={{fontFamily: "Helvetica"}}>Helvetica</Dropdown.Item>
                            <Dropdown.Item active={(font === "Lucida Console") ? true : false} onSelect={e => {setFont("Lucida Console");setEdited(true);}} style={{fontFamily: "Lucida Console"}}>Lucida Console</Dropdown.Item>
                            <Dropdown.Item active={(font === "Georgia") ? true : false} onSelect={e => {setFont("Georgia");setEdited(true);}} style={{fontFamily: "Georgia"}}>Georgia</Dropdown.Item>
                            <Dropdown.Item active={(font === "Garamond") ? true : false} onSelect={e => {setFont("Garamond");setEdited(true);}} style={{fontFamily: "Garamond"}}>Garamond</Dropdown.Item>
                            <Dropdown.Item active={(font === "Verdana") ? true : false} onSelect={e => {setFont("Verdana");setEdited(true);}} style={{fontFamily: "Verdana"}}>Verdana</Dropdown.Item>
                            <Dropdown.Item active={(font === "Courier New") ? true : false} onSelect={e => {setFont("Courier New");setEdited(true);}} style={{fontFamily: "Courier New"}}>Courier New</Dropdown.Item>
                            <Dropdown.Item active={(font === "Monaco") ? true : false} onSelect={e => {setFont("Monaco");setEdited(true);}} style={{fontFamily: "Monaco"}}>Monaco</Dropdown.Item>
                            <Dropdown.Item active={(font === "Brush Script MT") ? true : false} onSelect={e => {setFont("Brush Script MT");setEdited(true);}} style={{fontFamily: "Brush Script MT"}}>Brush Script MT</Dropdown.Item>
                            <Dropdown.Item active={(font === "Lucida Handwriting") ? true : false} onSelect={e => {setFont("Lucida Handwriting");setEdited(true);}} style={{fontFamily: "Lucida Handwriting"}}>Lucida Handwriting</Dropdown.Item>
                            <Dropdown.Item active={(font === "Copperplate") ? true : false} onSelect={e => {setFont("Copperplate");setEdited(true);}} style={{fontFamily: "Copperplate"}}>Copperplate</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <br></br>
                    <Dropdown id="collapsible-nav-dropdown">
                        <Dropdown.Toggle className="bg-transparent text-dark" id="dropdown-custom-components">
                        Font size: <b style={{fontFamily: font, fontSize: size}}>
                        {size === "75%" ? "Small Text" : null}
                        {size === "100%" ? "Medium Text" : null}
                        {size === "125%" ? "Large Text" : null}</b>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item active={(size === "75%") ? true : false} onSelect={e => {setSize("75%");setEdited(true);}} style={{fontSize: '75%'}}>Small text</Dropdown.Item>
                            <Dropdown.Item active={(size === "100%") ? true : false} onSelect={e => {setSize("100%");setEdited(true);}} style={{fontSize: '100%'}}>Normal Text</Dropdown.Item>
                            <Dropdown.Item active={(size === "125%") ? true : false} onSelect={e => {setSize("125%");setEdited(true);}} style={{fontSize: '125%'}}>Large Text</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Button variant="success" type="submit" className="mt-5">Save Changes</Button>

                </Form>
            </Modal.Body>
        </Modal>
            {(user !== null && typeof user !== 'undefined')
            ? 
                <>
                
                {typeof(images[0]) !== 'undefined' && typeof(images[0].base64preview) !== 'undefined'
                 ? <><img src={prefix + `${binaryToBase64(images[0].base64preview.data)}`}  alt="Preview"/></>
                 : null}
                
                <div className="mt-4">
                <h3><b>{user.fullname}</b></h3>
                <p>
                {typeof(profile[0]) !== 'undefined' && profile[0].current_occupation
                ? <b>{profile[0].current_occupation}</b>
                : null}
                {typeof(profile[0]) !== 'undefined' && profile[0].current_organization
                    ? <> at {profile[0].current_organization}</>
                    : null}
                </p>
                </div>
                

                {/* <p><b>Username:</b> {user.username}</p>
                <p><b>Email: </b>{user.email}</p> */}

                <br></br>
                </> 

            : null}

        </div>
    )
}