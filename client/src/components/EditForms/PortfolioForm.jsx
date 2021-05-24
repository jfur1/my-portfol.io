import { AreYouSure } from '../AreYouSure';
import Switch  from '../switch';
import { AlertDismissible } from '../alertDismissible';
import { Nav, Tab, Modal, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export const PortfolioForm = (props) => {
    
    const ChangeOrder = (props) => {
        console.log("ChangeOrder Component Recieved ID:", props.droppableId)
        return (
            <DragDropContext 
                onDragEnd={props.handleOnDragEnd}
            >
            {props.droppableId === "projects"
            ? <Droppable droppableId="projects">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {props.projects.values.map((row, idx) => {
                        return (
                            <Draggable key={idx} draggableId={row.title} index={idx}>
                                {(provided) => (
                                
                                    <div className='draggable-container mb-4 ml-3 mr-3' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                                    {row.title
                                        ? <b>{row.title}</b>
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
            : null}

            {props.droppableId === "work-experience"
            ? <Droppable droppableId="work-experience">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {props.portfolio.values.map((row, idx) => {
                        return (
                            <Draggable key={idx} draggableId={row.occupation} index={idx}>
                                {(provided) => (
                                
                                    <div className='draggable-container mb-4 ml-3 mr-3' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                                    {row.occupation
                                        ? <b>{row.occupation}</b>
                                        : null}
                                    {row.organization
                                        ? <>{' | ' + row.organization}</>
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
            : null}

            {props.droppableId === "education"
            ? <Droppable droppableId="education">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {props.education.values.map((row, idx) => {
                        return (
                            <Draggable key={idx} draggableId={row.education} index={idx}>
                                {(provided) => (
                                
                                    <div className='draggable-container mb-4 ml-3 mr-3' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                                    {row.education
                                        ? <b>{row.education}</b>
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
            : null}
            </DragDropContext>
        );
    }

    function length(obj) {
        if((!(typeof(obj) !== 'undefined')) || (obj == null)) return 0;
        return Object.keys(obj).length;
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
                <Modal.Title id="contained-modal-title-vcenter">
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
            <Tab.Container id="left-tabs-example" defaultActiveKey="projects">
            <Form noValidate validated={props.validated} onSubmit={props.handleSave}>
                <Row>
                    <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link 
                                className={(length(props.errs["project"]) > 0) || (length(props.duplicateProject) > 0)
                                    ? "nav-error" 
                                    : ""}
                                eventKey="projects" 
                                onClick={() => props.setChangingOrder(false)}
                            >
                            Projects
                            {((length(props.errs["project"]) > 0) || (length(props.duplicateProject) > 0))
                            ? <Badge variant="danger" className='ml-4'>
                                {(length(props.errs["project"]) + length(props.duplicateProject))}
                                </Badge>
                            : null}
                            
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link 
                                className={(length(props.errs["portfolio"]) > 0) || (length(props.duplicateWork) > 0)
                                    ? "nav-error" : ""}
                                eventKey="work-exerience" 
                                onClick={() => props.setChangingOrder(false)}
                            >Work Experience
                            {(length(props.errs["portfolio"]) > 0) || (length(props.duplicateWork) > 0)
                            ? <Badge variant="danger" className='ml-1'>
                                {length(props.errs["portfolio"]) + length(props.duplicateWork)}
                                </Badge>
                            : null}
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link 
                                className={(length(props.errs["education"]) > 0) || (length(props.duplicateEducation) > 0)
                                ? "nav-error" : ""}  
                                eventKey="education" 
                                onClick={() => props.setChangingOrder(false)}
                            >Education
                            {(length(props.errs["education"]) > 0) || (length(props.duplicateEducation) > 0)
                            ? <Badge variant="danger" className='ml-4'>
                                {length(props.errs["education"]) + length(props.duplicateEducation)}
                                </Badge>
                            : null}
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    </Col>
                    <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey="projects">
                            <Form.Group>
                                <h4>Projects</h4>
                                {props.projects.values.length < 4
                                ? <Button onClick={() => props.addProject()} variant="outline-success" size="sm">Add Project</Button>  
                                : null }<br></br>
                                                               
                                {props.projectsData.length > 1
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

                                {props.changingOrder
                                ? <ChangeOrder
                                    droppableId="projects"
                                    projects={props.projects}
                                    education={props.education}
                                    portfolio={props.portfolio}
                                    handleOnDragEnd={props.handleOnDragEnd}
                                ></ChangeOrder>
                                : props.renderProjectsForm()}

                            </Form.Group>
                        </Tab.Pane>
                        <Tab.Pane eventKey="work-exerience">
                            <Form.Group>
                                <h4>Work Experience</h4>
                                {props.portfolio.values.length < 4
                                ? <Button onClick={() => props.addWorkExperience()} variant="outline-success" size="sm">Add Work Experience</Button>  
                                : null }<br></br>

                                {props.portfolioData.length > 1
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

                                {props.changingOrder
                                ? <ChangeOrder 
                                    droppableId="work-experience"
                                    projects={props.projects}
                                    education={props.education}
                                    portfolio={props.portfolio}
                                    handleOnDragEnd={props.handleOnDragEnd}
                                ></ChangeOrder>
                                : props.renderWorkExperienceForm()}
                            </Form.Group>
                        </Tab.Pane>
                        <Tab.Pane eventKey="education">
                            <Form.Group>
                                <h4>Education</h4>
                                {props.education.values.length < 4
                                ? <Button onClick={() => props.addEducation()} variant="outline-success" size="sm">Add Education</Button>  
                                : null }<br></br>

                                {props.educationData.length > 1
                                ? <><label>Change Order</label>
                                    <Switch
                                        isOn={props.changingOrder}
                                        handleToggle={() => {
                                            if(!props.validate()){
                                            console.log("Please address errs");
                                        } else{
                                            props.setChangingOrder(!props.changingOrder);
                                        }}}
                                    /></>
                                : null} 

                                {props.showDelete
                                ?    <AreYouSure
                                        showDelete={props.showDelete}
                                        setShowDelete={props.setShowDelete}
                                        deleteWork={props.deleteWorkExperience}
                                        deleteEdu={props.deleteEducation}
                                        deleteProject={props.deleteProject}
                                        setEdited={props.setEdited}
                                        requestedDelete={props.requestedDelete}
                                        setRequestedDelete={props.setRequestedDelete}
                                        idx={props.requestedDeleteIdx}
                                        setRequestedDeleteIdx={props.setRequestedDeleteIdx}
                                    />
                                :null}
                                
                                {props.changingOrder
                                ? <ChangeOrder 
                                    droppableId="education"
                                    projects={props.projects}
                                    education={props.education}
                                    portfolio={props.portfolio}
                                    handleOnDragEnd={props.handleOnDragEnd}
                                    ></ChangeOrder>
                                : props.renderEducationForm()}


                            </Form.Group>
                        </Tab.Pane>
                    </Tab.Content>
                    </Col>
                </Row>
                <Button variant="success" type="submit">Save Changes</Button>
            </Form>
            </Tab.Container>

            </Modal.Body>
            <Modal.Footer>
                
            </Modal.Footer>
        </Modal>
    )
}