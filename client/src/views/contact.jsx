import {useSpring, animated, interpolate} from 'react-spring';
import { useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Modal, Button } from 'react-bootstrap';

export const Contact = props => {
    console.log("Contact Recieved Props: ", props);
    // User Data
    const user = props.location.state.user;
    const info = props.location.state.contact;

    // Edit Data
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const {o, xyz, color} = useSpring({
    from: {o: 0, xyz: [0, 0, 0], color: 'black'},
    o: 1,
    xyz: [10, 20, 5],
    color: 'black'
    });


    return(
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

        <animated.div
            style={{
            // If you can, use plain animated values like always, ...
            // You would do that in all cases where values "just fit"
            color,
            // Unless you need to interpolate them
            background: o.interpolate(o => `rgba(166, 255, 249, ${o})`),
            // Which works with arrays as well
            transform: xyz.interpolate((x, y, z) => `translate3d(${x}px, ${y}px, ${z}px)`),
            // If you want to combine multiple values use the "interpolate" helper
            border: interpolate([o, color], (o, c) => `${o * 10}px solid ${c}`),
            // You can also form ranges, even chain multiple interpolations
            padding: o.interpolate({range: [0, 0.5, 1], output: [0, 0, 10]}).interpolate(o => `${o}%`),
            // Interpolating strings (like up-front) through ranges is allowed ...
            borderColor: o.interpolate({range: [0, 1], output: ['#a6fff9', '#a6fff9']}),
            // There's also a shortcut for plain, optionless ranges ...
            opacity: o.interpolate([0.1, 0.2, 0.6, 1], [1, 0.1, 0.5, 1]),
            }}
        >
            <h2>{user.firstname} {user.lastname}</h2>
            {props.data.ownedByUser ? <PencilFill size={25} onClick={handleShow}/> : null}
            
            <p>Welcome to your personalized contact page!</p>
            <p><b>Email: </b>{user.email}</p>
            <br></br>
            {info 
            ? info.map((row, idx) => 
                <div key={idx}>
                    <p><b>Link:</b> {row.link}</p>
                    <br></br>
                </div>
            )
            : null } 
        </animated.div>
        </>
    );
}