import { useEffect, useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import { AlertDismissible } from '../components/alertDismissible';
import Switch  from '../components/switch';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export const About = props => {
    //console.log("About Recieved Parent Props: ", props);
    
    // User Data
    const info = (props.data.about !== null) ? props.data.about : props.location.state.about;
    const user = (props.location.state.user !== null) ? props.location.state.user : props.data.user;
    const hobbiesData = (props.data.hobbies !== null) ? props.data.hobbies : props.location.state.hobbies;
    const skillsData = (props.data.skills !== null) ? props.data.skills : props.location.state.skills;

    // Hooks used to keep track of current edits
    const [show, setShow] = useState(false);
    const [edited, setEdited] = useState(false);
    const [showAlert, setShowAlert] = useState(false); 

    const [reordered, setReordered] = useState(false);
    const [changingOrder, setChangingOrder] = useState(false);

    const [location, setLocation] = useState((info !== null && info.location !== null) ? info.location : null);
    const [bio, setBio] = useState((info !== null && info.bio !== null) ? info.bio : null);
    const [hobbies, setHobbies] = useState({values: hobbiesData});
    const [skills, setSkills] = useState({values: skillsData});

    const [validated, setValidated] = useState(false);
    const [errs, setErrs] = useState({}); 
    
    const [duplicateSkill, setDuplicateSkill] = useState({});
    const [duplicateHobby, setDuplicateHobby] = useState({});


    // Hooks used to format final onClick data for POST request
    
    const [skillsToDelete, setSkillToDelete] = useState([]);
    const [hobbiesToDelete, setHobbyToDelete] = useState([]);

    // After successful post request, profile.jsx updates state with new data
    // New data passed to hobbiesData/skillsData, and is copied into hobbies/skills hooks
    // where data can be manipulated by user
    useEffect(() => {
        setHobbies({values: hobbiesData});
        setSkills({values: skillsData});
        setHobbyToDelete([]);
        setSkillToDelete([]);
        setValidated(false);
        setErrs({});
        setDuplicateSkill({});
        setDuplicateHobby({});
    }, [hobbiesData, skillsData]);

    // Toggle Modal
    const handleShow = () => setShow(true);
    const handleClose = () => {
        if(edited){
            setShowAlert(true);
        } else{
            setHobbies({values: hobbiesData});
            setSkills({values: skillsData});
            setDuplicateSkill({});
            setDuplicateHobby({});
            setChangingOrder(false);
            setShow(false);    
        }
    }

    // Replace state with original data
    const discardChanges = () => {
        setLocation(info.location);
        setBio(info.bio);
        setHobbies({values: hobbiesData});
        setSkills({values: skillsData});
        setHobbyToDelete([]);
        setSkillToDelete([]);
        setChangingOrder(false);
        setReordered(false);
        setErrs({});
        setDuplicateSkill({});
        setDuplicateHobby({});
    }


    // ----------- [BEGIN] Hobby Handlers -------------------
    const renderHobbiesForm = () => {
        return (
            <Form.Group controlId="validationCustom02">
            {hobbies.values.map((row, idx) =>
                <Form.Row className='mb-4 ml-3 mr-3' key={idx}>
                    <Form.Control 
                        required
                        style={{width: '70%'}}
                        isInvalid={(errs["hobby"] && row.hobby === "") || (typeof(duplicateHobby["Idx"+idx]) !== 'undefined' && row.hobby !== "")}
                        type="text" 
                        value={row.hobby} 
                        placeholder={"Enter Hobby"} 
                        onChange={e => {
                            handleHobbyChange(e, idx);
                    }}/>
                    <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => removeHobby(idx)}    
                    >Delete</Button>
                    <Form.Control.Feedback type="invalid">
                        {errs["hobby"] && row.hobby === ""
                            ? "Please provide a hobby."
                            : null}
                        {typeof(duplicateHobby["Idx"+idx]) !== 'undefined' && row.hobby !== ""
                            ? "Duplicate hobbies are not allowed."
                            : null
                        }
                    </Form.Control.Feedback>
                </Form.Row>
            )}
            </Form.Group>
        )
    }
    const handleHobbyChange = (event, idx) => {
        let tmpHobbies = [...hobbies.values];
        tmpHobbies[idx] = {
            hobby_id: hobbies.values[idx].hobby_id, 
            uid: hobbies.values[idx].uid ,
            hobby: event.target.value
        };
        if((typeof(tmpHobbies[idx].hobby_id) !== 'undefined')
        && !(typeof(tmpHobbies[idx].toUpdate) !== 'undefined')){
            tmpHobbies[idx].toUpdate = true;
        }
        if((hobbies.values.some(e => e.hobby === event.target.value))){
            setDuplicateHobby({...duplicateHobby, ["Idx"+idx]: true});
        }
        else if(!(hobbies.values.some(e => e.hobby === event.target.value)) && typeof(duplicateHobby["Idx"+idx]) !== 'undefined'){
            delete duplicateHobby["Idx"+idx];
        }
        setHobbies({values: tmpHobbies});
        setEdited(true);
    }
    const addHobby = () => {
        setHobbies({values: 
            [
                ...hobbies.values, 
                {hobby: ''}
            ]
        });
    }
    const removeHobby = (idx) => {
        let tmpHobbies = [...hobbies.values];
        // Trying to delete hobby with an existing ID? => stage hobby to be deleted
        if(typeof(tmpHobbies[idx].hobby_id) !== 'undefined'){
            setHobbyToDelete(
                [
                    ...hobbiesToDelete,
                    {hobby_id: tmpHobbies[idx].hobby_id}
                ]);
        }
        tmpHobbies.splice(idx, 1);
        setHobbies({values: tmpHobbies});
        setEdited(true);
    }


    // ----------- [BEGIN] Skill Handlers ------------------- 

    const renderSkillsForm = () => {
        return (
            <Form.Group controlId="validationCustom01">
             {skills.values.map((row, idx) =>
                <Form.Row className='mb-4 ml-3 mr-3' key={idx}>
                    <Form.Control 
                            required
                            style={{width: '70%'}}
                            isInvalid={(errs["skill"] && row.skill === "") || (typeof(duplicateSkill["Idx"+idx]) !== 'undefined' && row.skill !== "")}
                            type="text" 
                            value={row.skill} 
                            placeholder={"Enter skill"} 
                            onChange={e => {
                                handleSkillChange(e, idx);
                        }}/>
                    <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => removeSkill(idx)}    
                    >Delete</Button>
                    <Form.Control.Feedback type="invalid">
                        {(errs["skill"] && row.skill === "")
                            ? "Please provide a skill."
                            : null}
                        {typeof(duplicateSkill["Idx"+idx]) !== 'undefined' && row.skill !== ""
                            ? "Duplicate skills are not allowed."
                            : null
                        }
                    </Form.Control.Feedback>
                </Form.Row>
            )}
            </Form.Group>
        )
    }
    const handleSkillChange = (event, idx) => {
        let tmpSkills = [...skills.values];
        tmpSkills[idx] = {
            skill_id: skills.values[idx].skill_id, 
            uid: skills.values[idx].uid ,
            skill: event.target.value
        };
        if((typeof(tmpSkills[idx].skill_id) !== 'undefined')
        && !(typeof(tmpSkills[idx].toUpdate) !== 'undefined')){
            tmpSkills[idx].toUpdate = true;
        }
        if(skills.values.some(e => e.skill === event.target.value)){
            setDuplicateSkill({...duplicateSkill, ["Idx"+idx] : true});
        }
        else if(!(skills.values.some(e => e.skill === event.target.value)) && typeof(duplicateSkill["Idx"+idx]) !== 'undefined'){
            delete duplicateSkill["Idx"+idx];
        }
        setSkills({values: tmpSkills});
        setEdited(true);
    }
    const addSkill = () => {
        setSkills({values: 
            [
                ...skills.values,
                {skill: ''}
            ]
        });
    }
    const removeSkill = (idx) => {
        let tmpSkills = [...skills.values];
        // Trying to delete skill with an existing ID? => stage skill to be deleted
        if(typeof(tmpSkills[idx].skill_id) !== 'undefined'){
            setSkillToDelete( 
                [
                    ...skillsToDelete, 
                    {skill_id: tmpSkills[idx].skill_id}
                ]);
        } 
        tmpSkills.splice(idx, 1);
        setSkills({values: tmpSkills});
        setEdited(true);
    }

    // ----------- [END] Skill Handlers -------------------
    function handleOnDragEnd(result) {
        console.log(result)
      if (!result.destination) return;

      // Sorting in same list
      if(result.source.droppableId === result.destination.droppableId){
        if(result.source.droppableId === "hobbies"){
            const items = Array.from(hobbies.values);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
        
            setReordered(true);
            setEdited(true);
            setHobbies({values: items});
        } else if(result.source.droppableId === "skills"){
            const items = Array.from(skills.values);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
        
            setReordered(true);
            setEdited(true);
            setSkills({values: items});
        }

      } else{
          console.log("No sorting between lists!");
          return;
      }
    }
    
    const ChangeOrder = () => {
        return (
            <Form.Row className="text-center">
            <DragDropContext 
                onDragEnd={handleOnDragEnd}
            >
            <Col>
                <Droppable droppableId="hobbies">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {hobbies.values.map((row, idx) => {
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
                        {skills.values.map((row, idx) => {
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

    const validate = () => {
        let isValidated = true;
        let errors = {};
        hobbies.values.forEach((row, idx) => {
            if(!(typeof(row.hobby_id) !== 'undefined') && (row.hobby === "")){
                isValidated = false;
                setValidated(false);
                errors["hobby"] = true;
            }
            if(typeof(duplicateHobby["Idx"+idx]) !== 'undefined'){
                isValidated = false;
                setValidated(false);
            }
        })
        skills.values.forEach((row, idx) => {
            if(!(typeof(row.skill_id) !== 'undefined') && (row.skill === "")){
                isValidated = false;
                setValidated(false);
                errors["skill"] = true;
            }
            if(typeof(duplicateSkill["Idx"+idx]) !== 'undefined'){
                isValidated = false;
                setValidated(false);
            }
        })
        setErrs(errors);
        return isValidated;
    }

    // Format edit hooks to be sent in POST request
    const handleSave = async(event) => {
        if(!validate()){
            event.preventDefault();
            event.stopPropagation();
        } else{
        
        // Location
        let locationToCreate = [];
        let locationToUpdate = [];
        let bioToCreate = [];
        let bioToUpdate = [];
        var hobbiesToCreate = [];
        var hobbiesToUpdate = [];
        var skillsToCreate = [];
        var skillsToUpdate = [];
        
        if(info === null && location){
            locationToCreate.push(JSON.stringify(location).replace(/['"]+/g, ''));
        } else if(info.location !== location){
            //console.log(`Set location update from: ${info.location} to: ${location}`);
            locationToUpdate.push(JSON.stringify(location).replace(/['"]+/g, ''));
        }

        // Bio
        if(info === null && bio){
            bioToCreate.push(JSON.stringify(bio).replace(/['"]+/g, ''));
        } else if(info.bio !== bio){
            //console.log(`Set bio update from: ${info.bio} to: ${bio}`);
            bioToUpdate.push(JSON.stringify(bio).replace(/['"]+/g, ''));
        }

        // Hobbies: 
        // No ID? => CREATE new hobby
        // Existing ID? => UPDATE existing hobby
        hobbies.values.forEach((row, idx) => {
            //console.log(`Row: ${row.hobby}, IDX: ${idx}`);
            if( !(typeof(row.hobby_id) !== 'undefined')){
                if(row.hobby === ''){
                    console.log('A hobby is required to create!');
                } else{
                    hobbiesToCreate.push({
                        hobby: row.hobby,
                        rowIdx: idx
                    });
                }
            } else if(typeof(row.toUpdate) !== 'undefined'){
                if(row.hobby === ''){
                    console.log('A hobby is required to update!');
                } else{
                    hobbiesToUpdate.push({
                        hobby_id: row.hobby_id,
                        hobby: row.hobby,
                        rowIdx: idx
                    })
                }
            }
        })
        // Skills: 
        // No ID? => CREATE new skill
        // Existing ID? => UPDATE existing skill
        skills.values.forEach((row, idx) => {
            //console.log(`Row: ${row.skill}, IDX: ${idx}`);
            if( !(typeof(row.skill_id) !== 'undefined')){
                if(row.skill === ''){
                    console.log("A skill is required to create!");
                } else{
                    skillsToCreate.push({
                        skill: row.skill,
                        rowIdx: idx
                    })
                }
            } else if(typeof(row.toUpdate) !== 'undefined'){
                if(row.skill === ''){
                    console.log("A skill is required to updated!");
                } else{
                    skillsToUpdate.push({
                        skill_id: row.skill_id,
                        skill: row.skill,
                        rowIdx: idx
                    })
                }
            }
        })
        
        console.log("Location to Update:", locationToCreate);
        console.log("Location to Update:", locationToUpdate);
        console.log("Bio to Create:", bioToCreate);
        console.log("Bio to Update:", bioToUpdate);
        console.log("Hobbies to Create", hobbiesToCreate);
        console.log("Hobbies to Update:", hobbiesToUpdate);
        console.log("Hobbies to Delete:", hobbiesToDelete);
        console.log("Skills to Create:", skillsToCreate);
        console.log("Skills to Update:", skillsToUpdate);
        console.log("Skills to Delete:", skillsToDelete);
        
        
        // Begin POST requests

        const createLocation = async() => {
            await props.createLocation(user.user_id, locationToCreate[0]);
        }
        if(locationToCreate.length) await createLocation();

        const updateLocation = async() => {
            await props.updateLocation(locationToUpdate[0], user.user_id);
        }
        if(locationToUpdate.length) await updateLocation();

        const createBio = async() => {
            await props.createBio(user.user_id, bioToCreate[0]);
        }
        if(bioToCreate.length) await createBio();

        const updateBio = async() => {
            await props.updateBio(bioToUpdate[0], user.user_id)
        }
        if(bioToUpdate.length) await updateBio();

        const createHobbies = async() => {
            for await (let hobbyToCreate of hobbiesToCreate){
                await props.createHobby(user.user_id, hobbyToCreate.hobby, hobbyToCreate.rowIdx);
            }
        }
        if(hobbiesToCreate.length) await createHobbies();

        const updateHobbies = async() => {
            for await(let hobbyToUpdate of hobbiesToUpdate){
                await props.updateHobby(hobbyToUpdate.hobby_id, hobbyToUpdate.hobby, user.user_id, hobbyToUpdate.rowIdx)
            }
        }
        if(hobbiesToUpdate.length) await updateHobbies();

        const createSkills = async() => {
            for await (let skillToCreate of skillsToCreate){
                await props.createSkill(user.user_id, skillToCreate.skill, skillToCreate.rowIdx);
            }
        }
        if(skillsToCreate.length) await createSkills();

        const updateSkills = async() => {
            for await (let skillToUpdate of skillsToUpdate){
                await props.updateSkill(skillToUpdate.skill_id, skillToUpdate.skill, user.user_id, skillToUpdate.rowIdx);
            }
        }
        if(skillsToUpdate.length) await updateSkills();

        const reorder = async() => {
            hobbies.values.forEach(async (row, rowIdx) => {
                await props.updateHobby(row.hobby_id, row.hobby, user.user_id, rowIdx);
            })
            skills.values.forEach(async (row, rowIdx) => {
                await props.updateSkill(row.skill_id, row.skill, user.user_id, rowIdx);
            })
        }
        if(reordered) await reorder();

        const deleteSkills = async() => {
            for await (let skillToDelete of skillsToDelete){
                await props.deleteSkill(skillToDelete.skill_id);
            }
        }
        if(skillsToDelete.length) await deleteSkills();

        const deleteHobbies = async() => {
            for await (let hobbyToDelete of hobbiesToDelete){
                await props.deleteHobby(hobbyToDelete.hobby_id);
            }
        }
        if(hobbiesToDelete.length) await deleteHobbies();
       

        window.location.reload();
        }
    };

    function NewlineText(props) {
        const text = props.text;
        if(text == null) return null;
        return text.split("\\n").map((str, idx) => 
            <div key={idx}>{str.length === 0 ? <br/> : str}</div>
        );
    }

    return(
        <div className="tab-container">
        {props.data.ownedByUser 
        ? <Button variant="danger" className="edit-button" onClick={handleShow}>Edit&nbsp;<PencilFill size={25}/></Button>
        : null}
        <h3>About</h3>
        <h3>{user.firstname} {user.lastname}</h3>
        <br/>

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
                <Form noValidate validated={validated} onSubmit={handleSave}>
                    
                    <Form.Row className='mt-3'>
                        <Form.Label column sm={2}>
                            Location
                        </Form.Label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="location" 
                            defaultValue={(info !== null && info.location !== null) ? info.location : ''} 
                            onChange={e => 
                                {setLocation(e.target.value); 
                                setEdited(true);
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
                            defaultValue={(info !== null && info.bio !== null) ? info.bio.replace(/\\n/g, '\n') : ''} 
                            onChange={e => {
                                setBio(e.target.value); 
                                setEdited(true);
                            }}/>
                    </Form.Row>
                    
                    <Form.Group className="mt-4">
                        {(hobbiesData.length > 1 || skillsData.length > 1)
                        ? <>
                        <label>Change Order</label>
                            <Switch
                                isOn={changingOrder}
                                handleToggle={() => {
                                    if(!validate()){
                                        console.log("Please address errs");
                                    } else{
                                        setChangingOrder(!changingOrder);
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

                            {changingOrder ? null : renderHobbiesForm()}
                            
                            {hobbies.values.length < 6 && !changingOrder
                                ? <Button 
                                    onClick={() => addHobby()} 
                                    variant="outline-success" 
                                    size="sm"    
                                >Add Hobby</Button>
                                : null }
                                
                        </Col> 
                        <Col>
                            <Form.Label className='text-center'>
                                <h4>Skills</h4>
                            </Form.Label > <br></br>

                            {changingOrder ? null : renderSkillsForm()}

                            {skills.values.length < 6 && !changingOrder
                            ? <Button 
                                onClick={() => addSkill()} 
                                variant="outline-success" 
                                size="sm"    
                            >Add Skill</Button>
                            : null }
                        </Col>
                    </Form.Row>

                    {changingOrder 
                        ? <ChangeOrder></ChangeOrder>
                        : null}

                    <Button variant="success" type="submit" className="mt-5">Save Changes</Button>

                </Form>             
            </Modal.Body>
            <Modal.Footer>
            
            </Modal.Footer>
        </Modal>

        <div className="info-container">
            <div className="draggable-container">
                <h4><b>Location:</b></h4>
                    {info !== null 
                    ? info.location
                    : null}
            </div>
            <br></br>
            <div className="draggable-container">
                <h4><b>Bio:</b></h4>
            <><NewlineText text={info !== null ? info.bio : ''}/></>
            </div>
            <br></br>
        </div>

        <div className="user-container">
            <h4><b>Hobbies:</b>
            {hobbiesData
            ? hobbiesData.map((row, idx) => 
                <div className="simple-border" key={idx}>
                    <p>{row.hobby}</p>
                </div>
            ) 
            : null}</h4>
            <br></br>
            <h4><b>Skills:</b>
            {skillsData 
            ? skillsData.map((row, idx) => 
                <div className="simple-border" key={idx}>
                    <p>{row.skill}</p>
                </div>
            ) 
            : null}</h4>
        </div>
    </div>
    );
}