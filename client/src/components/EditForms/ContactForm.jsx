import { Modal, Button, Form, Col } from 'react-bootstrap';
import { AlertDismissible } from '../alertDismissible';
import { AreYouSure } from '../AreYouSure'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Switch  from '../switch';

export const ContactForm = (props) =>{
    
    const ChangeLinksOrder = () => {
        return (
            <DragDropContext 
                onDragEnd={props.handleOnDragEnd}
            >
            <Droppable droppableId="links">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {props.links.values.map((row, idx) => {
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

    return(
        <Modal
            show={props.show}
            onHide={props.handleClose}
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
                            setShow={props.setShow}
                            setEdited={props.setEdited}
                            setShowAlert={props.setShowAlert}
                            showAlert={props.showAlert}
                            handleSave={props.handleSave}
                            discardChanges={props.discardChanges}
                        />

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                <Form noValidate validated={props.validated} onSubmit={props.handleSave}>
                    <h4>Contact Information</h4>
                    <Form.Row className='mt-4'>
                        <Form.Label column sm={2}>
                            Public Email
                        </Form.Label>
                        <Col>
                            <Form.Control type="email" style={{width: "55%"}} 
                            defaultValue={props.publicEmail} 
                            onChange={e => {
                                props.setPublicEmail(e.target.value); 
                                props.setEdited(true);
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
                            defaultValue={props.phone} 
                            onChange={e => {
                                props.setPhone(e.target.value);
                                props.setEdited(true);
                            }}/>
                        </Col>
                    </Form.Row>

                    <Form.Group>
                        <Form.Label className='mt-4'>
                            <h4>Links</h4>
                        </Form.Label > <br></br>
                            {props.links.values.length < 6
                                ? <Button 
                                onClick={() => props.addLink()} 
                                variant="outline-success" 
                                size="sm" 
                                disabled={props.changingOrder}
                                >Add Link</Button>
                                
                                : null }
                            <br></br>

                            {props.linksData.length > 1
                            ? <><label>Change Order</label>
                                <Switch
                                    isOn={props.changingOrder}
                                    handleToggle={() => {
                                        if(!props.validate()){
                                            console.log("Please address errs");
                                        } else{
                                            props.setChangingOrder(!props.changingOrder);
                                        }
                                    }}
                                /></>
                            : null}

                            {props.showDelete
                                ?    <AreYouSure
                                        showDelete={props.showDelete}
                                        setShowDelete={props.setShowDelete}
                                        removeLink={props.removeLink}
                                        setEdited={props.setEdited}
                                        requestedDelete={props.requestedDelete}
                                        setRequestedDelete={props.setRequestedDelete}
                                        idx={props.requestedDeleteIdx}
                                        setRequestedDeleteIdx={props.setRequestedDeleteIdx}
                                    />
                                :null}
                       

                        {props.changingOrder 
                        ? <ChangeLinksOrder></ChangeLinksOrder>
                        : props.renderLinksForm()}

                    </Form.Group>
                    <Button variant="success" type="submit">Save Changes</Button>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>
    )
}