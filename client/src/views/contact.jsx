import { useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import { AlertDismissible } from '../components/alertDismissible';

export const Contact = (props) => {
    console.log("Contact Recieved Props: ", props);

    // Original Data from Parent Profile
    const user = (props.location.state.user !== null) ? props.location.state.user : props.data.user;
    const linksData = props.location.state.contact;
    const about = props.location.state.about;

    // Display Toggles
    const [show, setShow] = useState(false);
    const [edited, setEdited] = useState(false);
    const [showAlert, setShowAlert] = useState(false); 
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [publicEmail, setPublicEmail] = useState(about.public_email);
    const [phone, setPhone] = useState(about.phone)
    const [links, setLinks] = useState({values: linksData})


    // Replace state with original data
    const discardChanges = () => {
        setPublicEmail(user.email);
        setPhone(about.phone);
        setLinks({values: linksData});
    }

    const handleSave = () => {

    }


    const renderLinksForm = () => {
        return linksData.map((row, idx) => 
            <Form.Row className='mb-4 ml-3' key={idx}>
                <Form.Row className='mt-1' style={{width: "75%"}}>
                    <Form.Label column sm={3}>
                        Title
                    </Form.Label>
                    <Col>
                        <Form.Control type="text" value={row.title || ''} onChange={()=>console.log("Placeholder")}/>
                    </Col>
                    
                </Form.Row>

                <Form.Row className='mt-1' style={{width: "75%"}}>
                    <Form.Label column sm={3}>
                        Link
                    </Form.Label>
                    <Col>
                        <Form.Control type="text" value={row.link} onChange={()=>console.log("Placeholder")}/>
                    </Col>
                </Form.Row>

                <Col className='mt-1'><Button variant="outline-danger" size="sm">Delete Link</Button></Col>   
            
                <Form.Row className='mt-1' style={{width: "75%"}}>
                    <Form.Label column sm={3}>
                        Description
                    </Form.Label>
                    <Col>
                        <Form.Control as="textarea" rows={3} id="link-description" value={row.description || ''} placeholder={"Add a description for your link!"} onChange={()=>console.log("Placeholder")}></Form.Control>
                    </Col>
                </Form.Row>
            </Form.Row>
        );
    }


    return (
        <div className="tab-container"> 
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="lg"
                centered
                scrollable={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h3>Edit</h3>
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

                <Form>
                    <h4>Contact Information</h4>
                    <Form.Row className='mt-4'>
                        <Form.Label column sm={2}>
                            Public Email
                        </Form.Label>
                        <Col>
                            <Form.Control type="email" style={{width: "55%"}} defaultValue={user.email} onChange={e => {
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
                            <Form.Control type="text" style={{width: "55%"}} defaultValue={about.phone} onChange={e => {
                                setPhone(e.target.value);
                                setEdited(true);
                            }}/>
                        </Col>
                    </Form.Row>

                    <Form.Group>
                        <Form.Label className='mt-4'>
                            <h4>Links</h4>
                            <Button variant="outline-success" size="sm">Add Link</Button>
                        </Form.Label>
                        {renderLinksForm()}
                    </Form.Group>
                    

                </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleClose}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* After integrating backend, render original data not tmpHooks */}
            <h3>{user.firstname} {user.lastname}</h3>
            <h4>
                <p>Contact</p>
                {props.data.ownedByUser 
                ? <PencilFill size={25} onClick={handleShow}/> 
                : null}
            </h4>

            <div className="info-container">

                {publicEmail
                ? <><h4>Email: </h4>
                <section>{publicEmail}</section></>
                : null }

                <br/>

                {phone
                ? <><h4>Phone: </h4>
                <section>{phone}</section></>
                : null }

                </div>
                <br></br>
                
                <h4>My Links</h4>
                <div className="links-container">
                {linksData 
                ? linksData.map((row, idx) => 
                    <div key={idx}>
                        <p>
                            {row.title 
                            ? <b>{row.title}: </b>
                            : <b>Link: </b> }
                            <br/>

                            <a href={row.link} target="_blank">{row.link}</a>

                            <br/>

                            {row.description 
                            ? <section>{row.description}</section>
                            : null }
                        </p>
                    </div>
                    )
                : null }
                
            </div>
        </div>
    );
}