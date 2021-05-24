import { useEffect, useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Button, Form } from 'react-bootstrap';
import Fade from 'react-reveal/Fade';
import { AboutForm } from '../components/EditForms/AboutForm';

export const About = props => {
    //console.log("About Recieved Parent Props: ", props);
    
    // User Data
    const info = (props.data.about !== null) ? props.data.about : null;
    const user = (props.location.state.user !== null) ? props.location.state.user : props.data.user;
    const hobbiesData = (props.data.hobbies !== null) ? props.data.hobbies : props.location.state.hobbies;
    const images = (props.data.images !== null) ? props.data.images : props.location.state.images;
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
        setLocation((info !== null && info.location !== null) ? info.location : null);
        setBio((info !== null && info.bio !== null) ? info.bio : null);
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
                        style={{textAlign: "left", width: "70%"}}
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
                            style={{textAlign: "left", width: "70%"}}
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
        let locationToUpdate = [];
        let bioToUpdate = [];
        var hobbiesToCreate = [];
        var hobbiesToUpdate = [];
        var skillsToCreate = [];
        var skillsToUpdate = [];
        
        if((!info && location) || (info !== null && info.location !== location)){
            locationToUpdate.push(location);
        }

        // Bio
        // Need a better check for creates
        if((!info && bio) || (info !== null &&  info.bio !== bio)){
            bioToUpdate.push(bio);
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
        
        console.log("Location to Update:", locationToUpdate);
        console.log("Bio to Update:", bioToUpdate);
        console.log("Hobbies to Create", hobbiesToCreate);
        console.log("Hobbies to Update:", hobbiesToUpdate);
        console.log("Hobbies to Delete:", hobbiesToDelete);
        console.log("Skills to Create:", skillsToCreate);
        console.log("Skills to Update:", skillsToUpdate);
        console.log("Skills to Delete:", skillsToDelete);
        
        
        // Begin POST requests
        if(locationToUpdate.length) 
            await props.updateLocation(locationToUpdate[0], user.user_id);

        if(bioToUpdate.length) 
            await props.updateBio(bioToUpdate[0], user.user_id)

        if(hobbiesToCreate.length){
            for await (let hobbyToCreate of hobbiesToCreate){
                await props.createHobby(user.user_id, hobbyToCreate.hobby, hobbyToCreate.rowIdx);
            }
        }

        if(hobbiesToUpdate.length){
            for await(let hobbyToUpdate of hobbiesToUpdate){
                await props.updateHobby(hobbyToUpdate.hobby_id, hobbyToUpdate.hobby, user.user_id, hobbyToUpdate.rowIdx)
            }
        }

        if(skillsToCreate.length){
            for await (let skillToCreate of skillsToCreate){
                await props.createSkill(user.user_id, skillToCreate.skill, skillToCreate.rowIdx);
            }
        }

        if(skillsToUpdate.length){
            for await (let skillToUpdate of skillsToUpdate){
                await props.updateSkill(skillToUpdate.skill_id, skillToUpdate.skill, user.user_id, skillToUpdate.rowIdx);
            }
        }

        if(reordered){
            hobbies.values.forEach(async (row, rowIdx) => {
                await props.updateHobby(row.hobby_id, row.hobby, user.user_id, rowIdx);
            })
            skills.values.forEach(async (row, rowIdx) => {
                await props.updateSkill(row.skill_id, row.skill, user.user_id, rowIdx);
            })
        }

        if(skillsToDelete.length){
            for await (let skillToDelete of skillsToDelete){
                await props.deleteSkill(skillToDelete.skill_id);
            }
        }

        if(hobbiesToDelete.length){
            for await (let hobbyToDelete of hobbiesToDelete){
                await props.deleteHobby(hobbyToDelete.hobby_id);
            }
        }

        window.location.reload();
        }
    };

    function FormatTextarea(props) {
        let text = props.text;
        if(text == null) return null;
        return text.split("\n").map((str, idx) => 
            <div key={idx}>{str.length === 0 ? <br/> : str}</div>
        )
    }

    function binaryToBase64(data){
        var image = btoa(new Uint8Array(data).reduce(function (tmp, byte) {
            return tmp + String.fromCharCode(byte);
        }, ''));
        return image;
    }

    return(
        <div className="tab-container">
        {props.data.ownedByUser 
        ? <Button variant="warning" className="edit-button" onClick={handleShow}>Edit&nbsp;<PencilFill size={25}/></Button>
        : null}
        <h3>About</h3>
        <hr color="black"/>

        <AboutForm
            info={info}
            user={user}
            hobbiesData={hobbiesData}
            skillsData={skillsData}
            hobbies={hobbies}
            skills={skills}
            images={images}
            validated={validated}
            handleOnDragEnd={handleOnDragEnd}
            show={show}
            setShow={setShow}
            edited={edited}
            setEdited={setEdited}
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            setBio={setBio}
            setLocation={setLocation}
            validate={validate}
            changingOrder={changingOrder}
            setChangingOrder={setChangingOrder}
            addHobby={addHobby}
            addSkill={addSkill}
            renderHobbiesForm={renderHobbiesForm}
            renderSkillsForm={renderSkillsForm}
            handleSave={handleSave}
            discardChanges={discardChanges}
            handleClose={handleClose}
        />

        <div className="about-container">
            <Fade right>
            <div>
            {typeof(images[0]) !== 'undefined' && images[0].base64preview.data.length > 0
                 ? <img src={images[0].prefix + `${binaryToBase64(images[0].base64preview.data)}`}  alt="Preview"/>
                 : null}
            </div>
            </Fade>
            <div className="col ml-1">

                {info !== null && info.location !== null && location !== ''
                ? <Fade left>
                    <div className="d-flex flex-row mr-4 mb-2">
                    <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="align-self-center mr-3 bi bi-geo-alt-fill" viewBox="0 0 16 16">
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                    </div>
                    <div className="d-flex flex-column">
                        <FormatTextarea text={info.location}/>
                    </div>
                    </div>
                    </Fade>
                : null}


                {info !== null && info.bio !== null && bio !== ''
                ? <Fade left>
                    <div className="d-flex flex-row mr-4">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="align-self-center mr-3 bi bi-person-lines-fill" viewBox="0 0 16 16">
                            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/>
                        </svg>
                    </div>
                    <div className="d-flex flex-column">
                        <FormatTextarea text={info.bio}/>
                    </div>
                </div>
                </Fade>
                : null}
                
                <hr className='float-left' style={{width: '95%'}}/><br/>

                <Fade bottom>
                <div className="user-container row" style={{width: '95%'}}>
                    <div className='d-flex flex-column mx-auto'>
                        <h4><b>Hobbies:</b></h4>
                        {hobbiesData
                        ? hobbiesData.map((row, idx) => 
                            <Button className="my-1 noHover" style={{backgroundColor: '#45d2bce9', border: 'none'}} key={idx}>
                                {row.hobby}
                            </Button>
                        ) 
                        : null}
                    </div>
                    
                    <div className='d-flex flex-column mx-auto'>
                    <h4><b>Skills:</b></h4>
                    {skillsData 
                    ? skillsData.map((row, idx) => 
                        <Button className="my-1 noHover" style={{backgroundColor: '#45d2bce9', border: 'none'}} key={idx}>
                            {row.skill}
                        </Button>
                    ) 
                    : null}
                    </div>
                </div>
                </Fade>
            </div>
        </div>


    </div>
    );
}