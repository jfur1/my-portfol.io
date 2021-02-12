import { useEffect, useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Nav, Tab, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { AlertDismissible } from '../components/alertDismissible';
import DatePicker from 'react-datepicker'

export const Portfolio = props => {
    console.log("Portfolio Recieved Props: ", props);
    // User Data
    const user = props.location.state.user;
    const portfolioData = (props.data.portfolio !== null) ? props.data.portfolio: props.location.state.portfolio;
    const educationData = (props.data.education !== null) ? props.data.education : props.location.state.education;
    const projectsData = (props.data.projects !== null) ? props.data.projects : props.location.state.projects;

    // Display Toggles
    const [show, setShow] = useState(false);
    const [edited, setEdited] = useState(false);
    const [showAlert, setShowAlert] = useState(false); 
    
    const handleShow = () => setShow(true);
    const handleClose = () => {
        if(edited) setShowAlert(true);
        else setShow(false);
    }

    // Replace state with original data
    const discardChanges = () => {
        setPortfolio({values: portfolioData});
        setEducation({values: educationData});
        setProjects({values: projectsData});
    }

    // Data to be Modified

    // Projects
    const [projects, setProjects] = useState({values: projectsData});

    const [projectsToDelete, setProjectsToDelete] = useState([]);

    const [portfolio, setPortfolio] = useState({values: portfolioData});
    const [education, setEducation] = useState({values: educationData});

    // Upon successful POST response, props will change, so reset hooks
    useEffect(() => {
        setProjects({values: projectsData});
        setProjectsToDelete([]);

        setPortfolio({values: portfolioData});
        setEducation({values: educationData});
    }, [props])


    // --------------- Begin Projects Event Handling --------------

    const handleProjectTitleChange = (event, idx) => {
        let tmpProjects = [...projects.values];
        tmpProjects[idx].title = event.target.value;
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')
        && !(typeof(tmpProjects[idx].toUpdate) !== 'undefined')){
            tmpProjects[idx].toUpdate = true;
        }
        setProjects({values: tmpProjects});
        setEdited(true);
    }
    
    const handleProjectDescriptionChange = (event, idx) => {
        let tmpProjects = [...projects.values];
        tmpProjects[idx].description = event.target.value;
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')
        && !(typeof(tmpProjects[idx].toUpdate) !== 'undefined')){
            tmpProjects[idx].toUpdate = true;
        }
        setProjects({values: tmpProjects});
        setEdited(true);
    }

    const handleProjectOrganizationChange = (event, idx) => {
        let tmpProjects = [...projects.values];
        tmpProjects[idx].organization = event.target.value;
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')
        && !(typeof(tmpProjects[idx].toUpdate) !== 'undefined')){
            tmpProjects[idx].toUpdate = true;
        }
        setProjects({values: tmpProjects});
        setEdited(true);
    }

    const handleProjectStartChange = (date, idx) => {
        if(date !== null){
            date = date.toISOString().split('T')[0];
        }
        let tmpProjects = [...projects.values];
        tmpProjects[idx].from_when = date;
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')
        && !(typeof(tmpProjects[idx].toUpdate) !== 'undefined')){
            tmpProjects[idx].toUpdate = true;
        }
        setProjects({values: tmpProjects});
        setEdited(true);
    }

    const handleProjectFinishChange = (date, idx) => {
        if(date !== null){
            date = date.toISOString().split('T')[0];
        }
        let tmpProjects = [...projects.values];
        tmpProjects[idx].to_when = date;
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')
        && !(typeof(tmpProjects[idx].toUpdate) !== 'undefined')){
            tmpProjects[idx].toUpdate = true;
        }
        setProjects({values: tmpProjects});
        setEdited(true);
    }

    const handleProjectLinkChange = (event, idx) => {
        let tmpProjects = [...projects.values];
        tmpProjects[idx].link = event.target.value;
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')
        && !(typeof(tmpProjects[idx].toUpdate) !== 'undefined')){
            tmpProjects[idx].toUpdate = true;
        }
        setProjects({values: tmpProjects});
        setEdited(true);
    }

    const addProject = () => {
        setProjects({
            values: [
                ...projects.values, 
                {
                    title: '',
                    description: '',
                    organization: '',
                    from_when: "infinity",
                    to_when: "infinity",
                    link: ''
                }
            ]
        });
    }

    const deleteProject = (idx) => {
        let tmpProjects = [...projects.values];
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')){
            setProjectsToDelete(
                [
                    ...projectsToDelete, 
                    {project_id: tmpProjects[idx].project_id}
                ]);
        }
        tmpProjects.splice(idx, 1);
        setProjects({values: tmpProjects});
        setEdited(true);
    };


    // --------------- End Projects Event Handling --------------

    
    // --------------- Begin Portfolio Event Handling ------------

    const addWorkExperience = () => {

    }


    // --------------- End Portfolio Event Handling --------------


    // --------------- Begin Education Event Handling ------------

    const addEducation = () => {

    }


    // --------------- End Education Event Handling --------------



    const handleSave = () => {
        console.log("'Saving' Changes:");
        
        var projectsToCreate = [];
        var projectsToUpdate = [];

        projects.values.forEach((row, idx) => {
            
            if(!(typeof(row.project_id) !== 'undefined')){
                if(row.title === ''){
                    console.log("A title is required in order to create!");
                } else {
                    projectsToCreate.push({
                        title: row.title,
                        description: row.description,
                        organization: row.organization,
                        from_when: row.from_when,
                        to_when: row.to_when,
                        link: row.link
                    });
                }
            } else if(typeof(row.toUpdate) !== 'undefined'){
                projectsToUpdate.push({
                    project_id: row.project_id,
                    title: row.title,
                    description: row.description,
                    organization: row.organization,
                    from_when: row.from_when,
                    to_when: row.to_when,
                    link: row.link,
                    rowIdx: idx
                })
            }
        })

        console.log("Projects to Create:", projectsToCreate);
        console.log("Projects to Update:", projectsToUpdate);
        console.log("Projects to Delete:", projectsToDelete);

        if(projectsToCreate.length){
            const createProjects = async() => {
                var newProjects = [];
                for await (let projectToCreate of projectsToCreate){
                    const data = await props.createProject(user.user_id, projectToCreate, projectToCreate.rowIdx);
                    newProjects.push(data);
                }
                console.log("[About.jsx] Newly Created Projects: ", newProjects);
                props.setCreatedProjects(newProjects);
            }
            createProjects();
        }

        if(projectsToUpdate.length){
            projectsToUpdate.forEach((row, idx) => {
                props.updateProject(user.user_id, row, row.rowIdx);
            })
        }

        // Possible DELETE ops should come last -- involves forced refresh
        if(projectsToDelete.length) {
            //console.log(`** DELETE Skills with ID: ${skillsToDelete}`);
            const deleteProjects = async() => {
                for await (let projectToDelete of projectsToDelete){
                    await props.deleteProject(projectToDelete.project_id);
                }
            }
            deleteProjects();
        };

        setShow(false);
    }

    const renderProjectsForm = () => {
        return projects.values.map((row, idx) => 
        <Form.Row className='mb-4 ml-1' key={idx}>
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Project
                </Form.Label>
                <Col>
                    <Form.Control type="text" value={row.title || ''} placeholder={"Project Title (Required)"} 
                        onChange={e => handleProjectTitleChange(e, idx)}
                    />
                </Col>
            </Form.Row>

            <Col className='mt-1'>
                <Button variant="outline-danger" size="sm"
                    onClick={() => deleteProject(idx)}
                >Delete Project</Button>
            </Col>   

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Description
                </Form.Label>
                <Col>
                    <Form.Control as="textarea" rows="3" value={row.description} placeholder={"Add a description for your project!"} 
                        onChange={e => handleProjectDescriptionChange(e, idx)}
                    />
                </Col>
            </Form.Row>
        
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Organization
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="project-organization" value={row.organization || ''} placeholder={"Add an organization (Optional)"} onChange={e => handleProjectOrganizationChange(e, idx)}></Form.Control>
                </Col>
            </Form.Row>

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Start Date
                </Form.Label>
                <Col>
                    <Form.Control as={ DatePicker } 
                    selected={(row.from_when !== "infinity" && row.from_when !== null) ? new Date(row.from_when) : ''}   placeholder=
                    {"Add a start date for your project! (Optional)"} 
                    onChange={ date => {
                            handleProjectStartChange(date, idx);
                        
                    }}></Form.Control>
                    
                </Col>
            </Form.Row>
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Finish Date
                </Form.Label>
                <Col>
                    <Form.Control as={ DatePicker } 
                    selected={(row.to_when !== "infinity" && row.to_when !== null) ? new Date(row.to_when) : ''}  placeholder={"Add a finish date for your project! (Optional)"} 
                    onChange={date => {
                        handleProjectFinishChange(date, idx);
                    }}></Form.Control>
                    

                </Col>
            </Form.Row>

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Link
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="project-link" value={row.link || ''} placeholder={"Add an link for your project! (Optional)"} 
                        onChange={e => handleProjectLinkChange(e, idx)}
                    />
                </Col>
            </Form.Row>
        </Form.Row>
        )
    }

    const renderWorkExperienceForm = () => {
        return portfolio.values.map((row, idx) => 
        <Form.Row className='mb-4 ml-3' key={idx}>
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Title
                </Form.Label>
                <Col>
                    <Form.Control type="text" value={row.occupation || ''} placeholder={"Occupation Title"} onChange={() => console.log("Placeholder")}/>
                </Col>
            </Form.Row>

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Organization
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="organization" value={row.organization || ''} placeholder={"Add an organization. (Optional)"} onChange={() => console.log("Placeholder")}></Form.Control>
                </Col>
            </Form.Row>


            <Col className='mt-1'><Button variant="outline-danger" size="sm">Delete Work</Button></Col>   
        
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Start Date
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="work-start-date" value={row.from_when || ''} placeholder={"Add a start date for this job. (Optional)"} onChange={() => console.log("Placeholder")}></Form.Control>
                </Col>
                <Form.Label column sm={3}>
                    Finish Date
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="work-end-date" value={row.to_when || ''} placeholder={"Add a finish date for this job. (Optional)"} onChange={() => console.log("Placeholder")}></Form.Control>
                </Col>
            </Form.Row>

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Description
                </Form.Label>
                <Col>
                    <Form.Control as="textarea" rows="3" value={row.description || ''} placeholder={"Add a description (Optional)"} onChange={() => console.log("Placeholder")}/>
                </Col>
            </Form.Row>
        </Form.Row>
        )
    }

    const renderEducationForm = () => {
        return education.values.map((row, idx) => 
        <Form.Row className='mb-4 ml-3' key={idx}>
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Education
                </Form.Label>
                <Col>
                    <Form.Control type="text" value={row.education || ''} placeholder={"Education"} />
                </Col>
            </Form.Row>

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Organization
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="education-organization" value={row.organization || ''} placeholder={"Add an organization (Optional)"}></Form.Control>
                </Col>
            </Form.Row>


            <Col className='mt-1'><Button variant="outline-danger" size="sm">Delete Work</Button></Col>   
        
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Start Date
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="education-start-date" value={row.from_when || ''} placeholder={"Add a start date for this education. (Optional)"}></Form.Control>
                </Col>
                <Form.Label column sm={3}>
                    Finish Date
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="education-end-date" value={row.to_when || ''} placeholder={"Add a finish date for this education. (Optional)"}></Form.Control>
                </Col>
            </Form.Row>

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Description
                </Form.Label>
                <Col>
                    <Form.Control as="textarea" rows="3" value={row.description || ''} placeholder={"Add a description (Optional)"} />
                </Col>
            </Form.Row>
        </Form.Row>
        )
    }

    return(
        <div className="tab-container">        

        <h3>{user.firstname} {user.lastname}</h3>
        <p>Portfolio</p>

        {props.data.ownedByUser ? <PencilFill size={25} onClick={handleShow}/> : null}

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
            <Tab.Container id="left-tabs-example" defaultActiveKey="projects">
                <Row>
                    <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link eventKey="projects">Projects</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="work-exerience">Work Experience</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="education">Education</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    </Col>
                    <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey="projects">
                            <Form>
                                <h4>Projects</h4>
                                {projects.values.length < 4
                                ? <Button onClick={() => addProject()} variant="outline-success" size="sm">Add Project</Button>  
                                : null }
                                {renderProjectsForm()}
                            </Form>
                        </Tab.Pane>
                        <Tab.Pane eventKey="work-exerience">
                            <Form>
                                <h4>Work Experience</h4>
                                {portfolio.values.length < 4
                                ? <Button onClick={() => addWorkExperience()} variant="outline-success" size="sm">Add Work Experience</Button>  
                                : null }
                                {renderWorkExperienceForm()}
                            </Form>
                        </Tab.Pane>
                        <Tab.Pane eventKey="education">
                            <Form>
                                <h4>Education</h4>
                                {education.values.length < 4
                                ? <Button onClick={() => addEducation()} variant="outline-success" size="sm">Add Education</Button>  
                                : null }
                                {renderEducationForm()}
                            </Form>
                        </Tab.Pane>
                    </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleSave}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
        <br></br>

        <h3>Projects</h3>
        <div className="user-container">
            {projectsData
            ? projectsData.map((row, idx) => 
                <div key={idx}>
                    <h4><b>{row.title}</b></h4>
                    
                    <p>{row.description 
                    ? row.description : null}</p>

                    <p>{(row.organization && row.organization !== "null")
                    ? <p><b>Organization:</b> {row.organization}</p>
                    : null}</p>


                    {(row.link && row.link !== "null")
                    ? <p><b>Link: </b>{row.link}</p>
                    : null}
                    
                    
                    {(row.from_when && row.from_when !== "infinity")
                    ? <p><b>From:</b> {row.from_when} </p>
                    : null
                    }
                    
                    {(row.to_when && row.to_when !== "infinity")
                    ? <p><b>To:</b> {row.to_when}</p>
                    : <p><b>To:</b> Current</p>}
                    <br></br>
                </div>
            )
            : null}
        </div>

        <h3>Work Experience:</h3>
        <div className="user-container">
        {portfolioData
        ? portfolioData.map((row, idx) => 
            <div key={idx}>
                <p><b>Occupation:</b> {row.occupation}</p>
                <p><b>Organization:</b> {row.organization}</p>
                <p><b>From:</b> {row.from_when}</p>
                <p><b>To:</b> {row.to_when}</p>

                {row.description
                ? <><b>Description: </b>
                    <p>{row.description}</p>
                </>
                : null}
                <br></br>
            </div>
        )
        : null } 
        </div>

        <h3>Education</h3>
        <div className="user-container">
            {educationData 
            ? educationData.map((row, idx) => 
                <div key={idx}>
                    <p><b>Education: </b>{row.education}</p>

                    {row.organization 
                    ? <><b>Organization:</b><p>{row.organization}</p></>
                    : null}

                    {row.from_when 
                    ? <><b>Start Date:</b><p>{row.from_when}</p></>
                    : null}

                    {row.to_when 
                    ? <><b>Finish Date:</b><p>{row.to_when}</p></>
                    : null}

                    {row.description
                    ? <><p>{row.description}</p></>
                    : null}
                    <br></br>
                </div>
            )
            : null}
        </div>

        </div>
    );
}