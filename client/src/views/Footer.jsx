import { useState } from 'react';
import { Modal } from 'react-bootstrap';

export const Footer = () => {
    const [showAbout, setShowAbout] = useState(false);
    const [showContact, setShowContact] = useState(false);
    // onClose Handlers
    const handleShowAbout = () => setShowAbout(true);
    const handleShowContact = () => setShowContact(true);
    const handleCloseAbout = () => setShowAbout(false);
    const handleCloseContact = () => setShowContact(false);
    
    return(
        <footer style={{
            height: '140px',
            position: 'relative'
        }}>
            
        <div className="footer-style">
            <h3>my-portfol.io</h3>
            <div className="modaling-style">
            <button style={{background: 'none', textDecoration: 'underline', border: 'none', color:'#18b848'}} onClick={handleShowAbout}>About us</button>
            <button style={{background: 'none', textDecoration: 'underline', border: 'none', color:'#18b848'}} onClick={handleShowContact}>Contact us</button>
            </div>
        </div>

        <Modal
            show={showAbout}
            onHide={handleCloseAbout}
            backdrop="static"
            size="lg"
            centered
            scrollable={false}>
                <Modal.Header closeButton><Modal.Title><h3>About my-portfol.io</h3></Modal.Title></Modal.Header>
                <Modal.Body><p>My-portfol.io was created and is managed by developers <a href="http://localhost:3000/johnfurlong" target="_blank" rel="noreferrer">John Furlong</a> and <a href="http://localhost:3000/tristanhanna" target="_blank" rel="noreferrer">Tristan Hanna</a>. We aim to solve all your recruting and job search needs with our platform.</p></Modal.Body>
        </Modal>

        <Modal
            show={showContact}
            onHide={handleCloseContact}
            backdrop="static"
            size="lg"
            centered
            scrollable={false}>
                <Modal.Header closeButton><Modal.Title><h3>Contact my-portfol.io</h3></Modal.Title></Modal.Header>
                <Modal.Body><p>You can contact us at myportfolio.support@gmail.com</p></Modal.Body>
        </Modal>
            
        </footer>
    )
}
