import { AlertDismissible } from '../alertDismissible';
import { Modal, Button, Form, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import UploadProfilePicture from '../../views/uploadProfilePic';

export const HomeForm = (props) => {

    return(
        <Modal
            show={props.show}
            onHide={props.handleClose}
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
                        setShow={props.setShow}
                        setEdited={props.setEdited}
                        setShowAlert={props.setShowAlert}
                        showAlert={props.showAlert}
                        handleSave={props.handleSave}
                        discardChanges={props.discardChanges}
                    />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate onSubmit={props.handleSave}>
                    
                    <Form.Row className='mt-3'>
                        <Form.Label column sm={2}>
                            Full Name
                        </Form.Label>
                        <input 
                            type="text" 
                            style={{textAlign:"left", width: "45%"}} 
                            className="form-control ml-1" 
                            defaultValue={props.fullname} 
                            onChange={e => 
                                {    
                                props.setFullname(e.target.value); 
                                props.setEdited(true);
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
                            defaultValue={props.currentOccupation} 
                            onChange={e => 
                                {props.setCurrentOccupation(e.target.value); 
                                props.setEdited(true); 
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
                            defaultValue={props.currentOrganization} 
                            onChange={e => 
                                {props.setCurrentOrganization(e.target.value); 
                                    props.setEdited(true);
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
                            defaultValue={(props.info !== null && props.info.location !== null) 
                                ? props.info.location 
                                : ''} 
                            onChange={e => 
                                {props.setLocation(e.target.value); 
                                    props.setEdited(true);
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
                                defaultValue={typeof(props.profile[0]) !== 'undefined' ? props.profile[0].public_email : null}  
                                onChange={e => {
                                    props.setPublicEmail(e.target.value); 
                                    props.setEdited(true);
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
                            defaultValue={typeof(props.profile[0]) !== 'undefined' ? props.profile[0].phone : null} 
                            onChange={e => {
                                props.setPhone(e.target.value);
                                props.setEdited(true);
                            }}/>
                        </Col>
                    </Form.Row>

                    <Form.Row className='mt-3'>
                        <Form.Label>
                            Edit Profile Picture
                        </Form.Label>
                    </Form.Row>

                    <Form.Row className='justify-content-center'>
                        {props.showEditPic 
                        ? <UploadProfilePicture 
                            stagePreview={props.stagePreview}
                            stageImage={props.stageImage}
                            stageCoords={props.stageCoords}
                            x={props.x}
                            y={props.y}
                            r={props.r}
                        />
                        : <img src={typeof(props.images[0]) !== 'undefined'
                            ? props.prefix + props.profileAvatar
                            : ''} alt="Preview"/>}
                        
                        {props.showDelete
                            ? <Modal
                                show={props.showDelete}
                                onHide={() => props.setShowDelete(false)}
                                backdrop="static"
                                keyboard={false}
                                size="sm"
                                centered
                                scrollable={false}
                            >
                            <Modal.Header closeButton>
                            <Modal.Title>Confirm Delete</Modal.Title>
                            </Modal.Header>
                                <Modal.Body>
                                    <p>Are you sure you want to remove your current avatar?</p>
                                </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => props.setShowDelete(false)}>Cancel</Button>
                                <Button variant="danger" 
                                    onClick={() => {
                                        props.setProfileAvatar('');
                                        props.setProfilePic('');
                                        props.setEdited(true);
                                        props.setShowDelete(false);
                                    }}>    
                                OK</Button>
                            </Modal.Footer>
                            </Modal>
                        :null}

                        {!props.showEditPic
                        ? <DropdownButton id="avatar-dropdown" title="edit" size="sm">
                            <Dropdown.Item eventKey="1" 
                                onClick={() => {
                                    props.setShowEditPic(!props.showEditPic);
                                    props.setEdited(true);
                                }}>
                                Upload a photo...
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={() => props.setShowDelete(true)}>Remove Photo</Dropdown.Item>
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
                            fontFamily: props.font
                        }}>{!props.font ? "Arial" : props.font}</b>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item 
                                active={(props.font === "Arial") ? true : false} 
                                onSelect={e => {
                                    props.setFont("Arial");
                                    props.setEdited(true);
                                }} 
                                style={{fontFamily: "Arial"}}>Arial</Dropdown.Item>
                            <Dropdown.Item 
                                active={(props.font === "Times New Roman") ? true : false} 
                                onSelect={e => {
                                    props.setFont("Times New Roman");
                                    props.setEdited(true);
                                }}
                                style={{fontFamily: "Times New Roman"}}>Times New Roman</Dropdown.Item>
                            <Dropdown.Item 
                                active={(props.font === "Helvetica") ? true : false} 
                                onSelect={e => {
                                    props.setFont("Helvetica");
                                    props.setEdited(true);
                                }} 
                                style={{fontFamily: "Helvetica"}}>Helvetica</Dropdown.Item>
                            <Dropdown.Item 
                                active={(props.font === "Lucida Console") ? true : false} 
                                onSelect={e => {
                                    props.setFont("Lucida Console");
                                    props.setEdited(true);
                                }} 
                                style={{fontFamily: "Lucida Console"}}>Lucida Console</Dropdown.Item>
                            <Dropdown.Item 
                                active={(props.font === "Georgia") ? true : false} 
                                onSelect={e => {
                                    props.setFont("Georgia");
                                    props.setEdited(true);
                                }} 
                                style={{fontFamily: "Georgia"}}>Georgia</Dropdown.Item>
                            <Dropdown.Item 
                                active={(props.font === "Garamond") ? true : false} 
                                onSelect={e => {
                                    props.setFont("Garamond");
                                    props.setEdited(true);
                                }} 
                                style={{fontFamily: "Garamond"}}>Garamond</Dropdown.Item>
                            <Dropdown.Item 
                                active={(props.font === "Verdana") ? true : false} 
                                onSelect={e => {
                                    props.setFont("Verdana");
                                    props.setEdited(true);
                                }} 
                                style={{fontFamily: "Verdana"}}>Verdana</Dropdown.Item>
                            <Dropdown.Item 
                                active={(props.font === "Courier New") ? true : false} 
                                onSelect={e => {
                                    props.setFont("Courier New");
                                    props.setEdited(true);
                                }} 
                                style={{fontFamily: "Courier New"}}>Courier New</Dropdown.Item>
                            <Dropdown.Item 
                                active={(props.font === "Monaco") ? true : false} 
                                onSelect={e => {
                                    props.setFont("Monaco");
                                    props.setEdited(true);
                                }}
                                style={{fontFamily: "Monaco"}}>Monaco</Dropdown.Item>
                            <Dropdown.Item 
                                active={(props.font === "Brush Script MT") ? true : false} 
                                onSelect={e => {
                                    props.setFont("Brush Script MT");
                                    props.setEdited(true);
                                }} 
                                style={{fontFamily: "Brush Script MT"}}>Brush Script MT</Dropdown.Item>
                            <Dropdown.Item 
                                active={(props.font === "Lucida Handwriting") ? true : false} 
                                onSelect={e => {
                                    props.setFont("Lucida Handwriting");
                                    props.setEdited(true);
                                }} 
                                style={{fontFamily: "Lucida Handwriting"}}>Lucida Handwriting</Dropdown.Item>
                            <Dropdown.Item 
                                active={(props.font === "Copperplate") ? true : false} 
                                onSelect={e => {
                                    props.setFont("Copperplate");
                                    props.setEdited(true);
                                }} 
                                style={{fontFamily: "Copperplate"}}>Copperplate</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <br></br>
                    <Dropdown id="collapsible-nav-dropdown">
                        <Dropdown.Toggle className="bg-transparent text-dark" id="dropdown-custom-components">
                        Font size: <b style={{fontFamily: props.font, fontSize: props.size}}>
                        {props.size === "75%" ? "Small Text" : null}
                        {props.size === "100%" ? "Medium Text" : null}
                        {props.size === "125%" ? "Large Text" : null}</b>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item 
                                active={(props.size === "75%") ? true : false} 
                                onSelect={e => {
                                    props.setSize("75%");
                                    props.setEdited(true);
                                }} 
                                style={{fontSize: '75%'}}>
                                    Small text
                            </Dropdown.Item>
                            <Dropdown.Item 
                                active={(props.size === "100%") ? true : false} 
                                onSelect={e => {
                                    props.setSize("100%");
                                    props.setEdited(true);
                                }} 
                                style={{fontSize: '100%'}}>
                                    Normal Text
                            </Dropdown.Item>
                            <Dropdown.Item 
                                active={(props.size === "125%") ? true : false} 
                                onSelect={e => {
                                    props.setSize("125%");
                                    props.setEdited(true);
                                }} 
                                style={{fontSize: '125%'}}>
                                    Large Text
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Button variant="success" type="submit" className="mt-5">Save Changes</Button>

                </Form>
            </Modal.Body>
        </Modal>
    )
}