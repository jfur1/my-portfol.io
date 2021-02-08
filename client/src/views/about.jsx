import { useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Modal, Button } from 'react-bootstrap';

export const About = props => {
    console.log("About Recieved Props: ", props);
    
    // User Data
    const info = (props.location.state.about !== null) ? props.location.state.about : props.data.about;
    const user = (props.location.state.user !== null) ? props.location.state.user : props.data.user;
    const hobbies = (props.location.state.hobbies !== null) ? props.location.state.hobbies : props.data.hobbies;
    const skills = (props.location.state.skills !== null) ? props.location.state.skills : props.data.skills;

    // Edit Data
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return(
        <div className="tab-container">
        
        <h2>{user.firstname} {user.lastname}</h2>
        <p>About Page</p>
        <br></br>

        {props.data.ownedByUser 
        ? <PencilFill size={25} onClick={handleShow}/> 
        : null}

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
              Edit About
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          I will not close if you click outside me. Don't even try to press
          escape key.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

        <div className="info-container">
        <h4><b>Location:</b> {info.location}</h4>
        <br></br>
        <h4><b>Bio:</b> {info.bio}</h4>
        <br></br>
        </div>

        <div className="info-container">
        <h4><b>Hobbies:</b>
        {hobbies 
        ? hobbies.map((row, idx) => 
            <div key={idx}>
                <p>{row.hobby}</p>
            </div>
        ) 
        : null}</h4>

        <h4><b>Skills:</b>
        {skills 
        ? skills.map((row, idx) => 
            <div key={idx}>
                <p>{row.skill}</p>
            </div>
        ) 
        : null}</h4>
        </div>
        </div>
    );
}