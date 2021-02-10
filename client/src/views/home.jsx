// Home Tab on a User's Profile
import { useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Modal, Button } from 'react-bootstrap';

export const Home = (props) => {
    //console.log("Home Component Recieved Props: ", props);
    const user = props.data.user;

    // Edit Data
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return(
        <div className="tab-container"> 
            
            {(user !== null && typeof user !== 'undefined')
            ? 
                <>
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
                <h3>
                    {user.firstname} {user.lastname} 
                    
                    {props.data.ownedByUser 
                    ? <PencilFill size={25} onClick={handleShow}/> 
                    : null}
                </h3>

                <br></br>

                <p><b>Username:</b> {user.username}</p>
                <p><b>Email: </b>{user.email}</p>
                <br></br>
                </> 

            : null}

        </div>
    )
}