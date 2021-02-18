import { useEffect, useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import { AlertDismissible } from '../components/alertDismissible';
import Switch  from '../components/switch';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


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
    
    const [reordered, setReordered] = useState(false);
    const [changingOrder, setChangingOrder] = useState(false);

    // Data to be Modified
    const [publicEmail, setPublicEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [links, setLinks] = useState({values: linksData});

    // POST request hooks
    const [emailToUpdate, setEmailToUpdate] = useState([]);
    const [phoneToUpdate, setPhoneToUpdate] = useState([]);
    const [linksToDelete, setLinksToDelete] = useState([]);

    const [validated, setValidated] = useState(false);
    const [errs, setErrs] = useState({}); 
    const [duplicates, setDuplicates] = useState({});

    // Event Handlers
    const handleShow = () => setShow(true);
    const handleClose = () => {
        if(edited){
            setShowAlert(true);
        }
        else {
            setShow(false);
            setChangingOrder(false);
            setLinks({values: linksData});
            setDuplicates({});
        }
    }

    // Replace state with original data
    const discardChanges = () => {
        setPublicEmail(profile.public_email);
        setPhone(profile.phone);
        setLinks({values: linksData});
        setChangingOrder(false);
        setReordered(false);
        setLinksToDelete([]);
        setValidated(false);
        setErrs({});
        setDuplicates({});
    }

    // form values change? => stage values to be updated
    useEffect(() => {
        if(profile.phone !== phone)
            setPhoneToUpdate(phone);
        if(profile.public_email !== publicEmail){
            setEmailToUpdate(publicEmail);
        }

    }, [phone, profile.phone, profile.public_email, publicEmail])

    //Upon successful POST response, linksData or aboutData will change, so reset hooks
    useEffect(() => {
        setPhoneToUpdate([]);
        setEmailToUpdate([]);
        setLinksToDelete([]);
        setLinks({values: linksData});
        setValidated(false);
        setErrs({});
        setDuplicates({});
    }, [props, linksData])


    const validate = () => {
        let isValidated = true;

        links.values.forEach((row, idx) => {
            if(row.link === ""){
                isValidated = false;
                setValidated(false);
                setErrs({link: true});
            }
            if(typeof(duplicates["Idx"+idx]) !== 'undefined'){
                console.log("Validation found duplicate at idx:", idx)
                isValidated = false;
                setValidated(false);
            }
        })
        return isValidated;
    }

    const handleSave = async(event) => {
        if(!validate()){
            event.preventDefault();
            event.stopPropagation();
        } else{

        console.log("Saving Changes:");
        console.log("Email to Update:", emailToUpdate);
        console.log("Phone to Update:", phoneToUpdate);

        var linksToCreate = [];
        var linksToUpdate = [];
        // Update/Insert (Upsert) Links?
        links.values.forEach((row, idx) => {
            if(!(typeof(row.link_id) !== 'undefined')){
                if(row.link === ""){
                    console.log("A link is required in order to create!")
                } else{
                    linksToCreate.push({
                        title: row.title,
                        link: row.link,
                        description: JSON.stringify(row.description).replace(/['"]+/g, ''),
                        rowIdx: idx
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
        console.log("links.values:", links.values);

        // Begin POST Requests
        const updatePhone = async() => {
            await props.updatePhone(user.user_id, phoneToUpdate);
        }
        if(phoneToUpdate.length) await updatePhone();

        
        const updateEmail = async() => {
            await props.updateEmail(user.user_id, emailToUpdate);
        }
        if(emailToUpdate.length) await updateEmail();


        const createLinks = async() => {
            for await (let linkToCreate of linksToCreate){
                await props.createLink(user.user_id, linkToCreate, linkToCreate.rowIdx);
            }
        }
        if(linksToCreate.length) await createLinks();


        const updateLinks = async() => {
            for await(let linkToUpdate of linksToUpdate){
                await props.updateLink(linkToUpdate.link_id, linkToUpdate.link, linkToUpdate.title, linkToUpdate.description, user.user_id, linkToUpdate.rowIdx);
            }
        }
        if(linksToUpdate.length) await updateLinks();


        const reorder = async() => {
            links.values.forEach(async (row, rowIdx) => {
                await props.updateLink(row.link_id, row.link, row.title, row.description, user.user_id, rowIdx);
            })
        }
        if(reordered) await reorder();


        const deleteLinks = async() => {
            for await (let linkToDelete of linksToDelete){
                await props.deleteLink(linkToDelete.link_id);
            }
        }
        if(linksToDelete.length) await deleteLinks();


        window.location.reload();
        }
    }
    
    const renderLinksForm = () => {
        return (
            <Form.Group controlId="validationCustom01">
            {links.values.map((row, idx) => 
                <Form.Row className='draggable-container mb-4 ml-3 mr-3' key={idx}>
                    <Form.Row className='mt-1' style={{width: "75%"}}>
                        <Form.Label column sm={3}>
                            Title
                        </Form.Label>
                        <Col>
                            <Form.Control type="text" value={row.title || ''} placeholder={"Link Title (Optional)"} 
                            onChange={e => {handleLinkTitleChange(e, idx)}}/>
                        </Col>
                    </Form.Row>
                    
    
                    <Form.Row className='mt-1 mr-2' style={{"width": "75%"}}>
                        <Form.Label column sm={3}>
                            Link
                        </Form.Label>
                        <Col>
                            <Form.Control 
                                required
                                isInvalid={(errs["link"] && row.link === "") || (typeof(duplicates["Idx"+idx]) !== 'undefined' && row.link !== "")}
                                type="text" 
                                value={row.link} 
                                placeholder={"Add your link here (Required)"} 
                                onChange={e => {
                                    handleLinkChange(e, idx);
                            }}/>
                            <Form.Control.Feedback type="invalid">
                                {/* Can't ever have both cases! */}
                                {(errs["link"] && row.link === "") 
                                ? "Please provide a Link." 
                                : null} 
                                {typeof(duplicates["Idx"+idx]) !== 'undefined' && row.link !== ""
                                ? "Duplicate links are not allowed."
                                : null
                                }
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Row>

                    <Col className='mt-1' style={{width: "75%"}}>
                        <Button onClick={() => removeLink(idx)} variant="outline-danger" size="sm">Delete Link</Button>
                    </Col>   
                
                    <Form.Row className='mt-1' style={{width: "75%"}}>
                            <Form.Label column sm={3}>
                                Description
                            </Form.Label>
                            <Col>
                                <Form.Control as="textarea" rows={3}
                                value={(row.description !== null) ? row.description.replace(/\\n/g, '\n') : ''} 
                                placeholder={"Add a description for your link! (Optional)"} 
                                onChange={e => {
                                    handleLinkDescriptionChange(e, idx);
                                }}></Form.Control>
                            </Col>
                        </Form.Row>
                </Form.Row>
            )}
            </Form.Group>
        );
    }

    const ChangeLinksOrder = () => {
        return (
            <DragDropContext 
                onDragEnd={handleOnDragEnd}
            >
            <Droppable droppableId="links">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {links.values.map((row, idx) => {
                        return (
                            <Draggable key={idx} draggableId={row.link} index={idx}>
                                {(provided) => (
                                
                                    <div className='draggable-container mb-4 ml-3 mr-3' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                                    {row.title
                                        ? row.title
                                        : null}
                                        
                                        <br></br>
                        
                                        {row.link
                                        ? row.link
                                        : null }

                                        <br></br>
                                    
                                        {row.description
                                        ? row.description
                                        : null}
                                    </div>
                                )}
                            </Draggable>
                        );
                    })}
                    {provided.placeholder}
                </div>
            )}
            </Droppable>
            </DragDropContext>
        );
    }

    const handleLinkTitleChange = (event, idx) => {
        let tmpLinks = [...links.values];
        tmpLinks[idx] = {
            link_id: links.values[idx].link_id,
            uid: links.values[idx].uid,
            link: links.values[idx].link,
            title: event.target.value,
            description: links.values[idx].description
        }
        if((typeof(tmpLinks[idx].link_id) !== 'undefined')
        && !(typeof(tmpLinks[idx].toUpdate) !== 'undefined')){
            tmpLinks[idx].toUpdate = true;
        }
        setLinks({values: tmpLinks});
        setEdited(true);
    }

    const handleLinkChange = (event, idx) => {
        let tmpLinks = [...links.values];
        tmpLinks[idx] = {
            link_id: links.values[idx].link_id,
            uid: links.values[idx].uid,
            link: event.target.value,
            title: links.values[idx].title,
            description: links.values[idx].description
        }
        if((typeof(tmpLinks[idx].link_id) !== 'undefined')
        && !(typeof(tmpLinks[idx].toUpdate) !== 'undefined')){
                tmpLinks[idx].toUpdate = true;
        }
        // If duplicate => add index to duplicates hook
        if((links.values.some(e => e.link === event.target.value))){
            console.log("Found duplicate:", event.target.value);
            setDuplicates({...duplicates, ["Idx"+idx]: true});
        } 
        // User fixes duplicate entry: not a duplicate, but exists as one in duplcates hook => remove
        else if(!(links.values.some(e => e.link === event.target.value)) && typeof(duplicates["Idx"+idx]) !== undefined){
            delete duplicates["Idx"+idx];
        }
        setLinks({values: tmpLinks});
        setEdited(true);
    }

    const handleLinkDescriptionChange = (event, idx) => {
        let tmpLinks = [...links.values];
        tmpLinks[idx] = {
                link_id: links.values[idx].link_id,
                uid: links.values[idx].uid,
                link: links.values[idx].link,
                title: links.values[idx].title,
                description: event.target.value
        }
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
        if(text == null) return null;
        return text.split("\\n").map((str, idx) => 
            <div key={idx}>{str.length === 0 ? <br/> : str}</div>
        );
    }


    function handleOnDragEnd(result) {
        console.log(result)
      if (!result.destination) return;
  
      const items = Array.from(links.values);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
  
      setReordered(true);
      setEdited(true);
      setLinks({values: items});
    }

    //console.log("Links data:", linksData);
    return (
        <div className="tab-container"> 
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="lg"
                centered
                scrollable={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
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

                <Form noValidate validated={validated} onSubmit={handleSave}>
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
                        </Form.Label > <br></br>
                            {links.values.length < 6
                                ? <Button 
                                onClick={() => addLink()} 
                                variant="outline-success" 
                                size="sm" 
                                disabled={changingOrder}
                                >Add Link</Button>
                                
                                : null }
                            <br></br>

                            {linksData.length > 1
                            ? <><label>Change Order</label>
                                <Switch
                                    isOn={changingOrder}
                                    handleToggle={() => setChangingOrder(!changingOrder)}
                                /></>
                            : null}

                       

                        {changingOrder 
                        ? <ChangeLinksOrder></ChangeLinksOrder>
                        : renderLinksForm()}

                    </Form.Group>
                    <Button variant="success" type="submit">Save Changes</Button>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>

            {/* After integrating backend, render original data not tmpHooks */}
            {props.data.ownedByUser ? <Button variant="danger" className="edit-button" onClick={handleShow}>Edit&nbsp;<PencilFill size={25}/></Button> : null}
            <h3>Contact Information</h3><br/>
            <h3>{user.firstname} {user.lastname}</h3>
            <br/>

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

                <div className="info-container">
                {linksData 
                ? linksData.map((row, idx) => 
                
                    <div className="draggable-container mb-4 ml-3 mr-3" key={idx}>
                        
                        {row.title 
                        ? <b>{row.title}: </b>
                        : null }
                        
                        <br></br>

                        <b>Link: </b>
                        <a href={row.link} target="_blank" rel="noreferrer">{row.link}</a>

                        <br/>

                        {row.description 
                        ? <NewlineText text={row.description} key={idx}/>
                        : null }
                        
                        <br></br>
                    </div>
                    )
                : null }
                
            </div>
            
        </div>
    );
}