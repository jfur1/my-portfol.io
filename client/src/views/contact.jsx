import { useEffect, useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import { AlertDismissible } from '../components/alertDismissible';
import { AreYouSure } from '../components/AreYouSure'
import Switch  from '../components/switch';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


export const Contact = (props) => {
    //console.log("Contact Recieved Props: ", props);

    // Original Data from Parent Profile
    const user = (props.location.state.user !== null) ? props.location.state.user : props.data.user;
    let profile = (props.data.profile !== null) ? props.data.profile : props.location.state.profile;
    const linksData = (props.data.contact !== null) ? props.data.contact : props.location.state.contact;
    const images = (props.data.images !== null) ? props.data.images : props.location.state.images;

    // Display Toggles
    const [show, setShow] = useState(false);
    const [edited, setEdited] = useState(false);
    const [showAlert, setShowAlert] = useState(false); 
    const [showDelete, setShowDelete] = useState(false);
    const [requestedDelete, setRequestedDelete] = useState('');
    const [requestedDeleteIdx, setRequestedDeleteIdx] = useState(null);
    
    const [reordered, setReordered] = useState(false);
    const [changingOrder, setChangingOrder] = useState(false);

    // Data to be Modified
    const [publicEmail, setPublicEmail] = useState(typeof(profile[0]) !== 'undefined' ? profile[0].public_email : '');
    const [phone, setPhone] = useState(typeof(profile[0]) !== 'undefined' ? profile[0].phone : '');
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
        setPublicEmail(publicEmail);
        setPhone(phone);
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
                        description: row.description,
                        rowIdx: idx
                    });
                }
            } else if((typeof(row.toUpdate) !== 'undefined')){
                linksToUpdate.push({
                    link_id: row.link_id,
                    title: row.title,
                    link: row.link,
                    description: row.description,
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
                await props.updateLink(linkToUpdate, user.user_id, linkToUpdate.rowIdx);
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
                                placeholder={"(Required) Ex: http://www.example.com"} 
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
                        <Button onClick={() => {
                            setRequestedDelete('link');
                            setRequestedDeleteIdx(idx);
                            setShowDelete(true);
                        }} variant="outline-danger" size="sm">Delete Link</Button>
                    </Col>   
                
                    <Form.Row className='mt-1' style={{width: "75%"}}>
                            <Form.Label column sm={3}>
                                Description
                            </Form.Label>
                            <Col>
                                <Form.Control as="textarea" rows={3}
                                defaultValue={(row.description !== null) ? row.description.replace(/\\n/g, '\n') : ''} 
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
    
    function binaryToBase64(data){
        var image = btoa(new Uint8Array(data).reduce(function (tmp, byte) {
            return tmp + String.fromCharCode(byte);
        }, ''));
        return image;
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

                                    {row.link
                                        ? <b>{row.link}</b>
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
        else if(!(links.values.some(e => e.link === event.target.value)) && typeof(duplicates["Idx"+idx]) !== "undefined"){
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

    function FormatTextarea(props) {
        let text = props.text;
        if(text == null) return null;
        return text.split("\n").map((str, idx) => 
            <div key={idx}>{str.length === 0 ? <br/> : str}</div>
        )
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
                            <Form.Control type="email" style={{width: "55%"}} 
                            defaultValue={publicEmail} 
                            onChange={e => {
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
                            <Form.Control 
                            type="text" 
                            style={{width: "55%"}} 
                            defaultValue={phone} 
                            onChange={e => {
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
                                    handleToggle={() => {
                                        if(!validate()){
                                            console.log("Please address errs");
                                        } else{
                                            setChangingOrder(!changingOrder);
                                        }
                                    }}
                                /></>
                            : null}

                            {showDelete
                                ?    <AreYouSure
                                        showDelete={showDelete}
                                        setShowDelete={setShowDelete}
                                        removeLink={removeLink}
                                        setEdited={setEdited}
                                        requestedDelete={requestedDelete}
                                        setRequestedDelete={setRequestedDelete}
                                        idx={requestedDeleteIdx}
                                        setRequestedDeleteIdx={setRequestedDeleteIdx}
                                    />
                                :null}
                       

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
            {props.data.ownedByUser ? <Button variant="warning" className="edit-button" onClick={handleShow}>Edit&nbsp;<PencilFill size={25}/></Button> : null}
            <h3>Contact Information</h3>
            <hr color="black"/>
            <br/>

        <div className="contact-container">
            <div className='mr-4'>
                {typeof(images[0]) !== 'undefined' && images[0].base64preview.data.length > 0
                 ? <img src={images[0].prefix + `${binaryToBase64(images[0].base64preview.data)}`}  alt="Preview"/>
                 : null}
            </div>
            
            <div className="col ml-1">
            {typeof(profile[0]) !== 'undefined' && profile[0].public_email !== null && publicEmail !== ''
                ? <div className="row ml-1 d-flex flex-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="align-self-center mr-2 bi bi-envelope-fill" viewBox="0 0 16 16">
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/>
                    </svg>
                    {profile[0].public_email}
                    </div>
                : null}

                {typeof(profile[0]) !== 'undefined' && profile[0].phone !== null && phone !== ''
                ? <div className="row ml-1 mt-3 d-flex flex-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="align-self-center mr-2 bi bi-telephone-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                    </svg>
                    {profile[0].phone}
                </div>
                : null}

                <hr className='my-4 mr-4'/>

                <div className="d-flex flex-row mt-3">
                    <div className='d-flex flex-column'>
                        <h4 className='mb-4'> My Links</h4>
                        {linksData 
                        ? linksData.map((row, idx) => 
                        
                            <div className="mb-1 ml-3 mr-3" key={idx}>
                                
                                {row.title 
                                ? <b>{row.title}</b>
                                : null }

                                {(row.link && row.link !== "null")
                                ? <div className='my-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-1 bi bi-link-45deg" viewBox="0 0 16 16">
                                        <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/>
                                    </svg>
                                    <a href={row.link} target="_blank" rel="noreferrer">{row.link}</a>
                                </div>
                                : null}

                                {row.description 
                                ? <FormatTextarea text={row.description} key={idx}/>
                                : null }
                                
                                <hr/>
                            </div>
                            )
                    : null }
                </div>

                </div>
            </div>
        </div>         
    </div>
    );
}