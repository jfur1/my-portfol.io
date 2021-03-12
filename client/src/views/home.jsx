// Home Tab on a User's Profile
import { useState } from 'react';
import { Modal, Button, Form, Dropdown, DropdownButton, Col } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';
import { AlertDismissible } from '../components/alertDismissible';
import UploadProfilePicture from './uploadProfilePic';

export const Home = (props) => {
    console.log("Home Component Recieved Props: ", props);
    const user = props.data.user;
    const profile = (props.data.profile !== null) ? props.data.profile : props.location.state.profile;
    const images = (props.data.images !== null) ? props.data.images : props.location.state.images;
    const info = (props.data.about !== null) ? props.data.about : props.location.state.about;

    // NOTE TO SELF: Type check for images -- (e.g. new user)

    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [edited, setEdited] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [fullname, setFullname] = useState(user.fullname);
    const [publicEmail, setPublicEmail] = useState(typeof(profile[0]) !== 'undefined' ? profile[0].public_email : '');
    const [phone, setPhone] = useState(typeof(profile[0]) !== 'undefined' ? profile[0].phone : '');
    const [location, setLocation] = useState((info !== null && info.location !== null) ? info.location : null);
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
    const [size, setSize] = useState(typeof(profile[0]) !== 'undefined' && profile[0].font_size ? profile[0].font_size : "100%");
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
        let locationToCreate = [];
        let locationToUpdate = [];
        
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

        if((!info && location) || (info !== null && info.location !== location)){
            //console.log(`Set location update from: ${info.location} to: ${location}`);
            locationToUpdate.push(location);
        }

        const createLocation = async() => {
            await props.createLocation(user.user_id, locationToCreate[0]);
        }
        if(locationToCreate.length) await createLocation();

        const updateLocation = async() => {
            await props.updateLocation(locationToUpdate[0], user.user_id);
        }
        if(locationToUpdate.length) await updateLocation();

        if((!typeof(profile.current_occupation) !== 'undefined') && currentOccupation)
            await createCurrentOccupation();
        else if(typeof(profile[0]) !== 'undefined' && currentOccupation !== profile[0].current_occupation)
            await updateCurrentOccupation();

        if((!typeof(profile.current_organization) !== 'undefined') && currentOrganization)
            await createCurrentOrganization();
        else if(typeof(profile[0]) !== 'undefined' && currentOrganization !== profile[0].current_organization)
            await updateCurrentOrganization();

        const updatePhone = async() => {
            await props.updatePhone(user.user_id, phone);
        }
        if((typeof(profile[0]) == 'undefined' && phone) || (typeof(profile[0]) !== 'undefined' && phone !== profile[0].phone)) await updatePhone();

        const updateEmail = async() => {
            await props.updateEmail(user.user_id, publicEmail);
        }
        if((typeof(profile[0]) == 'undefined' && publicEmail) || (typeof(profile[0]) !== 'undefined' && publicEmail !== profile[0].public_email)) await updateEmail();

        if(typeof(profile[0]) !== 'undefined' && font !== profile[0].font)
            await updateFont();
        
        if(typeof(profile[0]) !== 'undefined' && size !== profile[0].font_size)
            await updateSize();
            
        // Create Profile Picture
        if(typeof(images[0]) == 'undefined' && (profileAvatar || profilePic)){
            await createProfileImages();
        }
        else if(typeof(images[0]) !== 'undefined' && typeof(images[0].base64image) !== 'undefined'  && (profilePic !== images[0].base64image || profileAvatar !== images[0].base64preview)){
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

    function FormatTextarea(props) {
        let text = props.text;
        if(text == null) return null;
        return text.split("\\n").map((str, idx) => 
            <div key={idx}>{str.length === 0 ? <br/> : str}</div>
        )
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
                        <Form.Label column sm={2}>
                            Full Name
                        </Form.Label>
                        <input 
                            type="text" 
                            style={{textAlign:"left", width: "45%"}} 
                            className="form-control ml-1" 
                            defaultValue={fullname} 
                            onChange={e => 
                                {    
                                setFullname(e.target.value); 
                                setEdited(true);
                            }}
                        ></input>
                    </Form.Row>
                    <Form.Row className='mt-3'>
                        <Form.Label column sm={2}>
                            Current Occupation
                        </Form.Label>
                        <input 
                            type="text" 
                            style={{textAlign:"left", width: "45%"}} 
                            className="form-control ml-1 mt-2" 
                            defaultValue={currentOccupation} 
                            onChange={e => 
                                {setCurrentOccupation(e.target.value); 
                                setEdited(true); 
                            }}
                        ></input>
                    </Form.Row>
                    <Form.Row className='mt-3'>
                        <Form.Label column sm={2}>
                            Current Organization
                        </Form.Label>
                        <input 
                            type="text" 
                            style={{textAlign:"left", width: "45%"}} 
                            className="form-control ml-1 mt-2" 
                            defaultValue={currentOrganization} 
                            onChange={e => 
                                {setCurrentOrganization(e.target.value); 
                                setEdited(true);
                            }}
                        ></input>
                    </Form.Row>

                    <Form.Row className='mt-3'>
                        <Form.Label column sm={2}>
                            Location
                        </Form.Label>
                        <input 
                            type="text" 
                            style={{textAlign:"left", width: "45%"}} 
                            className="form-control ml-1" 
                            id="location" 
                            defaultValue={(info !== null && info.location !== null) 
                                ? info.location 
                                : ''} 
                            onChange={e => 
                                {setLocation(e.target.value); 
                                setEdited(true);
                            }}
                        ></input>
                    </Form.Row>

                    <Form.Row className='mt-4'>
                        <Form.Label column sm={2}>
                            Public Email
                        </Form.Label>
                        <Col>
                            <Form.Control 
                                type="email" 
                                style={{textAlign:"left", width: "55%"}} 
                                defaultValue={typeof(profile[0]) !== 'undefined' ? profile[0].public_email : null}  
                                onChange={e => {
                                    setPublicEmail(e.target.value); 
                                    setEdited(true);
                                }}/>
                            <Form.Text className="text-muted">
                            Public email to display on your profile.
                            </Form.Text>
                        </Col>
                    </Form.Row>

                    <Form.Row className='mt-3'>
                        <Form.Label column sm={2}>
                            Phone Number
                        </Form.Label>
                        <Col>
                            <Form.Control 
                            type="text" 
                            style={{textAlign:"left", width: "55%"}} 
                            defaultValue={typeof(profile[0]) !== 'undefined' ? profile[0].phone : null} 
                            onChange={e => {
                                setPhone(e.target.value);
                                setEdited(true);
                            }}/>
                        </Col>
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
            <div className='home-container'>
                <div className="mt-3 ml-2 mr-4">
                {typeof(images[0]) !== 'undefined' && images[0].base64preview.data.length > 0
                 ? <img src={prefix + `${binaryToBase64(images[0].base64preview.data)}`}  alt="Preview"/>
                 : null}
                </div> 


                <div className="mt-4 ml-4" style={{width: '100%'}}>
                    <h3><b>{user.fullname}</b></h3>
                    
                    <p>
                        {typeof(profile[0]) !== 'undefined' && profile[0].current_occupation
                        ? <b>{profile[0].current_occupation}</b>
                        : null}
                        {typeof(profile[0]) !== 'undefined' && profile[0].current_organization
                            ? <> at {profile[0].current_organization}</>
                            : null}
                    </p>

                    {info !== null && info.location !== null && location !== ''
                    ? <div className="row ml-1 d-flex flex-row">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="align-self-center mr-2 bi bi-geo-alt-fill" viewBox="0 0 16 16">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                        </svg>
                        <FormatTextarea text={info.location === "" ? '' : info.location}/>
                        </div>
                    : null}
                    
                    {info !== null && info.public_email !== null && publicEmail !== ''
                    ?<div className="row ml-1 mt-3 d-flex flex-row">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="align-self-center mr-2 bi bi-envelope-fill" viewBox="0 0 16 16">
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/>
                        </svg>
                        {info.public_email}
                        </div>
                    : null}
                    

                    {info !== null && info.phone !== null && phone !== ''
                    ? <div className="row ml-1 mt-3 d-flex flex-row">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="align-self-center mr-2 bi bi-telephone-fill" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                        </svg>
                        {info.phone}
                    </div>
                    : null}
                
                </div>

                <br></br>
            </div> 

            : null}

        </div>
    )
}