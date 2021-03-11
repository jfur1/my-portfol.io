import { useState } from 'react';
import { Modal } from 'react-bootstrap';

export const Footer = () => {
    const [showAbout, setShowAbout] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    // onClose Handlers
    const handleShowAbout = () => setShowAbout(true);
    const handleShowContact = () => setShowContact(true);
    const handleCloseAbout = () => setShowAbout(false);
    const handleCloseContact = () => setShowContact(false);
    const handleShowPrivacy = () => setShowPrivacy(true);
    const handleClosePrivacy = () => setShowPrivacy(false);
    
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
            <button style={{background: 'none', textDecoration: 'underline', border: 'none', color:'#18b848'}} onClick={handleShowPrivacy}>Privacy Policy</button>
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
                <Modal.Body><p>My-portfol.io was created and is managed by developers <a href="/johnfurlong" target="_blank" rel="noreferrer">John Furlong</a> and <a href="/tristanhanna" target="_blank" rel="noreferrer">Tristan Hanna</a>. We aim to solve all of your recruiting and job search needs with our platform.</p></Modal.Body>
        </Modal>

        <Modal
            show={showContact}
            onHide={handleCloseContact}
            backdrop="static"
            size="lg"
            centered
            scrollable={false}>
                <Modal.Header closeButton><Modal.Title><h3>Contact my-portfol.io</h3></Modal.Title></Modal.Header>
                <Modal.Body><p>You can contact us by email at myportfolio.help@gmail.com</p></Modal.Body>
        </Modal>

        <Modal
            show={showPrivacy}
            onHide={handleClosePrivacy}
            backdrop="static"
            size="lg"
            centered
            scrollable={false}>
                <Modal.Header closeButton><Modal.Title><h3>Privacy Policy</h3></Modal.Title></Modal.Header>
                <Modal.Body><p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit my-portfol.io (the “Site”).<br /><br/>

                                Personal information we collect<br/>
                                When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as “Device Information”.<br/>
                                <br/>
                                We collect Device Information using the following technologies:<br/>
                                - “Cookies” are data files that are placed on your device or computer and often include an anonymous unique identifier. For more information about cookies, and how to disable cookies, visit http://www.allaboutcookies.org.<br/>
                                - “Log files” track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.<br/>
                                - “Web beacons”, “tags”, and “pixels” are electronic files used to record information about how you browse the Site.<br/>
                                <br/>
                                When we talk about “Personal Information” in this Privacy Policy, we are talking both about Device Information and Order Information.<br/>
                                <br/>
                                How do we use your personal information?<br/>
                                We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:<br/>
                                - Communicate with you;<br/>
                                - Screen our orders for potential risk or fraud; and<br/>
                                - When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.<br/>
                                <br/>
                                We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site, and to assess the success of our marketing and advertising campaigns).<br/>
                                <br/>
                                Sharing you personal Information<br/>
                                We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Shopify to power our online store--you can read more about how Shopify uses your Personal Information here: https://www.shopify.com/legal/privacy. We also use Google Analytics to help us understand how our customers use the Site -- you can read more about how Google uses your Personal Information here: https://www.google.com/intl/en/policies/privacy/. You can also opt-out of Google Analytics here: https://tools.google.com/dlpage/gaoptout.<br/>
                                <br/>
                                Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.<br/>
                                <br/>
                                You can opt out of some of these services by visiting the Digital Advertising Alliance’s opt-out portal at: http://optout.aboutads.info/.<br/>
                                <br/>
                                Do not track<br/>
                                Please note that we do not alter our Site’s data collection and use practices when we see a Do Not Track signal from your browser.<br/>
                                <br/>
                                Your rights<br/>
                                If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.<br/>
                                <br/>
                                Additionally, if you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above. Additionally, please note that your information will be transferred outside of Europe, including to Canada and the United States.<br/>
                                <br/>
                                Changes<br/>
                                We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.<br/>
                                <br/>
                                Contact us<br/>
                                For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e‑mail at myportfolio.help@gmail.com</p></Modal.Body>
        </Modal>
            
        </footer>
    )
}
