import { useEffect, useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import { AlertDismissible } from '../components/alertDismissible';

export const Contact = (props) => {
    //console.log("Contact Recieved Props: ", props);

    // Original Data from Parent Profile
    const user = (props.location.state.user !== null) ? props.location.state.user : props.data.user;
    const profile = (props.data.profile !== null) ? props.data.profile : props.location.state.profile;
    const linksData = (props.data.contact !== null) ? props.data.contact : props.location.state.contact;

    // Display Toggles
    const [show, setShow] = useState(false);
    const [edited, setEdited] = useState(false);
    const [showAlert, setShowAlert] = useState(false); 

    // Data to be Modified
    const [publicEmail, setPublicEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [links, setLinks] = useState({values: linksData});

    // POST request hooks
    const [emailToUpdate, setEmailToUpdate] = useState([]);
    const [phoneToUpdate, setPhoneToUpdate] = useState([]);
    const [linksToDelete, setLinksToDelete] = useState([]);

    // Event Handlers
    const handleShow = () => setShow(true);
    const handleClose = () => {
        if(edited) setShowAlert(true);
        else setShow(false);
    }

    // Replace state with original data
    const discardChanges = () => {
        setPublicEmail(profile.public_email);
        setPhone(profile.phone);
        setLinks({values: linksData});
    }

    // form values change? => stage values to be updated
    useEffect(() => {
        if(profile.phone !== phone)
            setPhoneToUpdate(phone);
        if(profile.public_email !== publicEmail){
            setEmailToUpdate(publicEmail);
        }

    }, [phone, profile.phone, profile.public_email, publicEmail])

    // Upon successful POST response, linksData or aboutData will change, so reset hooks
    useEffect(() => {
        setPhoneToUpdate([]);
        setEmailToUpdate([]);
        setLinksToDelete([]);
        setPublicEmail(profile.public_email);
        setPhone(profile.phone);
        setLinks({values: linksData})
    }, [props, linksData, profile.publicEmail, profile.phone, profile.public_email])


    const handleSave = () => {

        console.log("'Saving' Changes:");

        console.log("Email to Update:", emailToUpdate);
        console.log("Phone to Update:", phoneToUpdate);

        if(emailToUpdate.length){
            props.updateEmail(user.user_id, emailToUpdate);
        }
        if(phoneToUpdate.length){
            props.updatePhone(user.user_id, phoneToUpdate);
        }
        var linksToCreate = [];
        var linksToUpdate = [];

        // Update/Insert (Upsert) Links?
        links.values.forEach((row, idx) => {
            // console.log("row:", row);
            // console.log("linksData[idx]",linksData[idx]);
            // console.log("links.values[idx]", links.values[idx]);
            if(!(typeof(row.link_id) !== 'undefined')){
                if(row.link === ""){
                    console.log("A link is required in order to create!")
                } else{
                    linksToCreate.push({
                        title: row.title,
                        link: row.link,
                        description: JSON.stringify(row.description).replace(/['"]+/g, ''),
                    });
                }
            } else if((typeof(row.toUpdate) !== 'undefined')){
                linksToUpdate.push({
                    link_id: row.link_id,
                    title: row.title,
                    link: row.link,
                    description: JSON.stringify(row.description).replace(/['"]+/g, ''),
                    rowIdx: idx
                });
            }
        })

        console.log("Links to Create:", linksToCreate);
        console.log("Links to Update:", linksToUpdate);
        console.log("Links to Delete", linksToDelete);        
        
        if(linksToCreate.length) {
            const createLinks = async() => {
                var newLinks = [];
                for await (let linkToCreate of linksToCreate){
                    const data = await props.createLink(user.user_id, linkToCreate);
                    //console.log("About.jsx Recieved Data from Profile.jsx:", data);
                    newLinks.push(data);
                }
                console.log("[About.jsx] Newly Created Links: ", newLinks);
                props.setCreatedLinks(newLinks);
            }
            createLinks();
        }

        if(linksToUpdate.length){
            linksToUpdate.forEach((row, rowIdx) => {
                props.updateLink(row.link_id, row.link, row.title, row.description, user.user_id, row.rowIdx);
            })
        }

        // Possible DELETE ops should come last -- involves forced refresh
        if(linksToDelete.length) {
            //console.log(`** DELETE Skills with ID: ${skillsToDelete}`);
            const deleteLinks = async() => {
                for await (let linkToDelete of linksToDelete){
                    await props.deleteLink(linkToDelete.link_id);
                }
                props.reloadProfile();
            }
            deleteLinks();
        };

        setShow(false);
    }

    
    const renderLinksForm = () => {
        return links.values.map((row, idx) => 
            <Form.Row className='mb-4 ml-3' key={idx}>
                <Form.Row className='mt-1' style={{width: "75%"}}>
                    <Form.Label column sm={3}>
                        Title
                    </Form.Label>
                    <Col>
                        <Form.Control type="text" value={row.title || ''} placeholder={"Link Title (Optional)"} onChange={e => {handleLinkTitleChange(e, idx)}}/>
                    </Col>
                </Form.Row>

                <Form.Row className='mt-1' style={{width: "75%"}}>
                    <Form.Label column sm={3}>
                        Link
                    </Form.Label>
                    <Col>
                        <Form.Control type="text" value={row.link} placeholder={"Add your link here (Required)"} onChange={e => {
                            handleLinkChange(e, idx);
                        }}/>
                    </Col>
                </Form.Row>

                <Col className='mt-1'><Button onClick={() => removeLink(idx)} variant="outline-danger" size="sm">Delete Link</Button></Col>   
            
                <Form.Row className='mt-1' style={{width: "75%"}}>
                    <Form.Label column sm={3}>
                        Description
                    </Form.Label>
                    <Col>
                        <Form.Control as="textarea" rows={3} id="link-description" 
                        value={row.description.replace(/\\n/g, '\n') || ''} 
                        placeholder={"Add a description for your link! (Optional)"} 
                        onChange={e => {
                            handleLinkDescriptionChange(e, idx);
                        }}></Form.Control>
                    </Col>
                </Form.Row>
            </Form.Row>
        );
    }

    const handleLinkTitleChange = (event, idx) => {
        let tmpLinks = [...links.values];
        tmpLinks[idx].title = event.target.value;
        if((typeof(tmpLinks[idx].link_id) !== 'undefined')
        && !(typeof(tmpLinks[idx].toUpdate) !== 'undefined')){
            tmpLinks[idx].toUpdate = true;
        }
        setLinks({values: tmpLinks});
        setEdited(true);
    }

    const handleLinkChange = (event, idx) => {
        let tmpLinks = [...links.values];
        tmpLinks[idx].link = event.target.value;
        if((typeof(tmpLinks[idx].link_id) !== 'undefined')
        && !(typeof(tmpLinks[idx].toUpdate) !== 'undefined')){
                tmpLinks[idx].toUpdate = true;
        }
        setLinks({values: tmpLinks});
        setEdited(true);
    }

    const handleLinkDescriptionChange = (event, idx) => {
        let tmpLinks = [...links.values];
        tmpLinks[idx].description = event.target.value;
        if((typeof(tmpLinks[idx].link_id) !== 'undefined') 
        && !(typeof(tmpLinks[idx].toUpdate) !== 'undefined')){
            tmpLinks[idx].toUpdate = true;
        }
        setLinks({values: tmpLinks});
        setEdited(true);
    }

    const addLink = () => {
        setLinks({values: [...links.values, {title: '', link: '', description: ''}]});
    }

    const removeLink = (idx) => {
        let tmpLinks = [...links.values];
        if((typeof(tmpLinks[idx].link_id) !== 'undefined')){
            // Must create hook since we're removing the link
            setLinksToDelete([...linksToDelete, {link_id: tmpLinks[idx].link_id}]);
        }
        tmpLinks.splice(idx, 1);
        setLinks({values: tmpLinks});
        setEdited(true);
    }

    function NewlineText(props) {
        const text = props.text;
        return text.split("\\n").map((str, idx) => 
            <div key={idx}>{str.length === 0 ? <br/> : str}</div>
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
                            <Form.Control type="email" style={{width: "55%"}} defaultValue={profile[0].public_email} onChange={e => {
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
                            <Form.Control type="text" style={{width: "55%"}} defaultValue={profile[0].phone} onChange={e => {
                                setPhone(e.target.value);
                                setEdited(true);
                            }}/>
                        </Col>
                    </Form.Row>

                    <Form.Group>
                        <Form.Label className='mt-4'>
                            <h4>Links</h4>
                            {links.values.length < 6
                            ? <Button onClick={() => addLink()} variant="outline-success" size="sm">Add Link</Button>  
                            : null }
                        </Form.Label>
                        {renderLinksForm()}
                    </Form.Group>
                    

                </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSave}>Save Changes</Button>
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

                {profile[0].public_email
                ? <><h4>Email: </h4>
                <p>{profile[0].public_email}</p></>
                : null }

                <br/>

                {profile[0].phone
                ? <><h4>Phone: </h4>
                <p>{profile[0].phone}</p></>
                : null }

                </div>
                <br></br>
                
                <h4>My Links</h4>
                <div className="links-container">
                {linksData 
                ? linksData.map((row, idx) => 
                    <div key={idx}>
                        
                        {row.title 
                        ? <b>{row.title}: </b>
                        : <b>Link: </b> }
                        <br/>

                        <a href={row.link} target="_blank" rel="noreferrer">{row.link}</a>

                        <br/>

                        {row.description 
                        ? <><NewlineText text={row.description} key={idx}/></>
                        : null }
                        
                    </div>
                    )
                : null }
                
            </div>
        </div>
    );
}