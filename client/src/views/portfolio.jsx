import { useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Modal, Button } from 'react-bootstrap';

export const Portfolio = props => {
    console.log("Portfolio Recieved Props: ", props);
    // User Data
    const user = props.location.state.user;
    const portfolio = props.location.state.portfolio;
    const education = props.location.state.education;
    const projects = props.location.state.projects;

    // Edit Data
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return(
        <div className="tab-container">        

        <h3>Hey {user.firstname} {user.lastname}</h3>
        <p>Portfolio Page</p>

        {props.data.ownedByUser ? <PencilFill size={25} onClick={handleShow}/> : null}

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
                    Edit
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
        
        <div className="user-container">
            <h3>Projects</h3>
            {projects 
            ? projects.map((row, idx) => 
                <div key={idx}>
                    <h4><b>Project: </b>{row.title}</h4>

                    <p>{row.organization 
                    ? row.organization : null}</p>

                    <p>{row.description 
                    ? row.description : null}</p>
                    
                    <p><b>From:</b> {row.from_when}</p>
                    <p><b>To:</b> {row.to_when}</p>
                    <p><b>To:</b> {row.link}</p>
                    <br></br>
                </div>
            )
            : null}
        </div>

        <div className="user-container">
        <h3>Work Experience:</h3>
        {portfolio
        ? portfolio.map((row, idx) => 
            <div key={idx}>
                <p><b>Occupation:</b> {row.occupation}</p>
                <p><b>Organization:</b> {row.organization}</p>
                <p><b>From:</b> {row.from_when}</p>
                <p><b>To:</b> {row.to_when}</p>
                <br></br>
            </div>
        )
        : null } 
        </div>

        <div className="user-container">
            <h3>Education</h3>
            {education 
            ? education.map((row, idx) => 
                <div key={idx}>
                    <p><b>Education: </b>{row.education}</p>
                    <p>{row.organization 
                    ? row.organization : null}</p>
                    <br></br>
                </div>
            )
            : null}
        </div>

        </div>
    );
}