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

        <h3>{user.firstname} {user.lastname}</h3>
        <p>Portfolio</p>

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
        <br></br>

        <h3>Projects</h3>
        <div className="user-container">
            {projects 
            ? projects.map((row, idx) => 
                <div key={idx}>
                    <h4><b>{row.title}</b></h4>
                    
                    <p>{row.description 
                    ? row.description : null}</p>

                    <p>{row.organization 
                    ? <p><b>Organization:</b> {row.organization}</p>
                    : null}</p>


                    {row.link 
                    ? <p><b>Link: </b>{row.link}</p>
                    : null}
                    
                    <p><b>From:</b> {row.from_when}</p>
                    
                    {row.to_when
                    ? <p><b>To:</b> {row.to_when}</p>
                    : <p><b>To:</b> Current</p>}
                    <br></br>
                </div>
            )
            : null}
        </div>

        <h3>Work Experience:</h3>
        <div className="user-container">
        {portfolio
        ? portfolio.map((row, idx) => 
            <div key={idx}>
                <p><b>Occupation:</b> {row.occupation}</p>
                <p><b>Organization:</b> {row.organization}</p>
                <p><b>From:</b> {row.from_when}</p>
                <p><b>To:</b> {row.to_when}</p>

                {row.description
                ? <><b>Description: </b>
                    <p>{row.description}</p>
                </>
                : null}
                <br></br>
            </div>
        )
        : null } 
        </div>

        <h3>Education</h3>
        <div className="user-container">
            {education 
            ? education.map((row, idx) => 
                <div key={idx}>
                    <p><b>Education: </b>{row.education}</p>

                    {row.organization 
                    ? <><b>Organization:</b><p>{row.organization}</p></>
                    : null}

                    {row.description
                    ? <><p>{row.description}</p></>
                    : null}
                    <br></br>
                </div>
            )
            : null}
        </div>

        </div>
    );
}