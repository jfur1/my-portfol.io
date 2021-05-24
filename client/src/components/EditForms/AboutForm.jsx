import { Modal, Button, Form, Col } from 'react-bootstrap';
import { AlertDismissible } from '../alertDismissible';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Switch from '../switch';

const ChangeOrder = (props) => {
    return (
        <Form.Row className="text-center">
        <DragDropContext 
            onDragEnd={props.handleOnDragEnd}
        >
        <Col>
            <Droppable droppableId="hobbies">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {props.hobbies.values.map((row, idx) => {
                        return (
                            <Draggable key={idx} draggableId={row.hobby} index={idx}>
                                {(provided) => (
                                
                                    <div 
                                    className='draggable-container mb-4 ml-3 mr-3' 
                                    ref={provided.innerRef} 
                                    {...provided.draggableProps} 
                                    {...provided.dragHandleProps}>

                                    {row.hobby
                                        ? row.hobby
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
        </Col>
        <Col>
            <Droppable droppableId="skills">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {props.skills.values.map((row, idx) => {
                        return (
                            <Draggable key={idx} draggableId={row.skill} index={idx}>
                                {(provided) => (
                                
                                    <div className='draggable-container mb-4 ml-3 mr-3' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                                    {row.skill
                                        ? row.skill
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
        </Col>
        </DragDropContext>
    </Form.Row>
    );
}

export const AboutForm = (props) => {




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
                Edit
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
                
                <Form.Row className='mt-3'>
                    <Form.Label column sm={2}>
                        Location
                    </Form.Label>
                    <input 
                        type="text" 
                        style={{textAlign: "left"}}
                        className="form-control" 
                        id="location" 
                        defaultValue={(props.info !== null && props.info.location !== null) 
                            ? props.info.location
                            : ''} 
                        onChange={e => 
                            {props.setLocation(e.target.value); 
                                props.setEdited(true);
                        }}
                    ></input>
                </Form.Row>

                <Form.Row className='mt-3'>
                    <Form.Label column sm={2}>
                        Bio
                    </Form.Label>
                        <textarea 
                            className="form-control" 
                            rows="5" 
                            id="bio" 
                            defaultValue={(props.info !== null && props.info.bio !== null) 
                                ? props.info.bio.replace(/\\n/g, '\n')
                                : null} 
                            onChange={e => {
                                props.setBio(e.target.value); 
                                props.setEdited(true);
                            }}/>
                </Form.Row>
                <Form.Group className="mt-4">
                    {(props.hobbiesData.length > 1 || props.skillsData.length > 1)
                    ? <>
                    <label>Change Order</label>
                        <Switch
                            isOn={props.changingOrder}
                            handleToggle={() => {
                                if(!props.validate()){
                                    console.log("Please address errs");
                                } else{
                                    props.setChangingOrder(!props.changingOrder);
                                }
                            }}
                        />
                        </>
                    : null}
                </Form.Group>

                <Form.Row className="text-center">
                    <Col>
                        <Form.Label className='text-center'>
                            <h4>Hobbies</h4>
                        </Form.Label > <br></br>

                        {props.changingOrder ? null : props.renderHobbiesForm()}
                        
                        {props.hobbies.values.length < 6 && !props.changingOrder
                            ? <Button 
                                onClick={() => props.addHobby()} 
                                variant="outline-success" 
                                size="sm"    
                            >Add Hobby</Button>
                            : null }
                            
                    </Col> 
                    <Col>
                        <Form.Label className='text-center'>
                            <h4>Skills</h4>
                        </Form.Label > <br></br>

                        {props.changingOrder ? null : props.renderSkillsForm()}

                        {props.skills.values.length < 6 && !props.changingOrder
                        ? <Button 
                            onClick={() => props.addSkill()} 
                            variant="outline-success" 
                            size="sm"    
                        >Add Skill</Button>
                        : null }
                    </Col>
                </Form.Row>

                {props.changingOrder 
                    ? <ChangeOrder {...props}></ChangeOrder>
                    : null}

                <Button variant="success" type="submit" className="mt-5">Save Changes</Button>

            </Form>             
        </Modal.Body>
        <Modal.Footer>
        
        </Modal.Footer>
    </Modal>
    )
}