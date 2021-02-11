import { useEffect, useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Modal, Button } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert'

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
    const [location, setLocation] = useState(info.location);
    const [bio, setBio] = useState(info.bio);
    const [hobbies, setHobbies] = useState({values: hobbiesData});
    const [skills, setSkills] = useState({values: skillsData});

    // Hooks used to format final onClick data for POST request
    const [locationToCreate, setLocationToCreate] = useState([]);
    const [bioToCreate, setBioToCreate] = useState([]);
    
    const [locationToUpdate, setLocationToUpdate] = useState([]);
    const [bioToUpdate, setBioToUpdate] = useState([]);
    
    const [skillsToCreate, setSkillsToCreate] = useState([]);
    const [skillsToUpdate, setSkillsToUpdate] = useState([]);
    const [skillsToDelete, setSkillToDelete] = useState([]);

    const [hobbiesToCreate, setHobbiesToCreate] = useState([]);
    const [hobbiesToUpdate, setHobbiesToUpdate] = useState([]);
    const [hobbiesToDelete, setHobbyToDelete] = useState([]);

    const [showLogs, setShowLogs] = useState(false);

    // After successful post request, profile.jsx updates state with new data
    // New data passed to hobbiesData/skillsData, and is copied into hobbies/skills hooks
    // where data can be manipulated by user
    useEffect(() => {
        setHobbies({values: hobbiesData});
        setSkills({values: skillsData});
        setHobbiesToCreate([]);
        setSkillsToCreate([]);
        setHobbyToDelete([]);
        setSkillToDelete([]);
        setLocationToCreate([]);
        setBioToCreate([]);
        //console.log(`[About.jsx] Updated Hobbies: ${JSON.stringify(hobbies)}`);
        //console.log(`[About.jsx] Updated Skills: ${JSON.stringify(skills)}`);
        //console.log(`[About.jsx] Updated hobbiesToCreate: ${JSON.stringify(hobbiesToCreate)}`);
    }, [hobbiesData, skillsData]);

    // Toggle Modal
    const handleShow = () => setShow(true);
    const handleClose = () => {
        if(edited){
            setShowAlert(true);
        } else{
            setShow(false);    
        }
    }

    // Replace state with original data
    const discardChanges = () => {
        setLocation(info.location);
        setBio(info.bio);
        setHobbies({values: hobbiesData});
        setSkills({values: skillsData});
    }

    function AlertDismissible() {
        return (
          <>
            <Alert bsPrefix="edit-alert" show={showAlert} variant="warning">
            <Alert.Heading style={{textAlign: 'center'}}>Attention!</Alert.Heading>
              <p style={{textAlign: 'center'}}>
                You have unsaved changes! Are you sure you want to exit?
              </p>
              <hr />
              <div className="d-flex justify-content-center">
                <Button onClick={() => {
                    setShow(false); 
                    handleSave(); 
                    setEdited(false); 
                    setShowAlert(false);
                }} variant="outline-success">
                    Save Changes
                </Button>
                <Button onClick={() => {
                    setShow(false); 
                    discardChanges();
                    setEdited(false); 
                    setShowAlert(false);
                }} variant="outline-danger">
                    Exit
                </Button>
              </div>
            </Alert>
          </>
        );
    }

    // ----------- [BEGIN] Hobby Handlers -------------------
    const renderHobbiesForm = () => {
        return hobbies.values.map((row, idx) =>
            <div className="form-group row" key={idx}>
                <input type="text" className="form-control" style={{width: '70%'}} value={row.hobby || ''} onChange={e => {handleHobbyChange(e, idx)}}/>
                <Button onClick={() => removeHobby(idx)} variant="outline-danger" size="sm">Delete</Button>
            </div>
        )
    }
    const handleHobbyChange = (event, idx) => {
        let tmpHobbies = [...hobbies.values];
        tmpHobbies[idx] = {
            hobby_id: hobbies.values[idx].hobby_id, 
            uid: hobbies.values[idx].uid ,
            hobby: event.target.value
        };
        if((typeof(tmpHobbies[idx].hobby_id) !== 'undefined')){
            tmpHobbies[idx].updated = true;
        }
        setHobbies({values: tmpHobbies});
        setEdited(true);
    }
    const addHobby = () => {
        setHobbies({values: [...hobbies.values, '']});
    }
    const removeHobby = (idx) => {
        let tmpHobbies = [...hobbies.values];
        // Trying to delete hobby with an existing ID? => stage hobby to be deleted
        if((typeof(tmpHobbies[idx].hobby_id) !== 'undefined')){
            setHobbyToDelete([...hobbiesToDelete, {hobby_id: tmpHobbies[idx].hobby_id}]);
        }
        tmpHobbies.splice(idx, 1);
        setHobbies({values: tmpHobbies});
        setEdited(true);
    }
    // ----------- [END] Hobby Handlers -------------------


    // ----------- [BEGIN] Skill Handlers ------------------- 

    const renderSkillsForm = () => {
        return skills.values.map((row, idx) =>
            <div className="form-group row" key={idx}>
                <input type="text" className="form-control" style={{width: '70%'}} value={row.skill || ''} onChange={e => {handleSkillChange(e, idx)}}/>
                <Button onClick={() => removeSkill(idx)} variant="outline-danger" size="sm">Delete</Button>
            </div>
        )
    }
    const handleSkillChange = (event, idx) => {
        let tmpSkills = [...skills.values];
        tmpSkills[idx] = {
            skill_id: skills.values[idx].skill_id, 
            uid: skills.values[idx].uid ,
            skill: event.target.value
        };
        if((typeof(tmpSkills[idx].skill_id) !== 'undefined')){
            tmpSkills[idx].updated = true;
        }
        setSkills({values: tmpSkills});
        setEdited(true);
    }
    const addSkill = () => {
        setSkills({values: [...skills.values, '']});
    }
    const removeSkill = (idx) => {
        let tmpSkills = [...skills.values];
        // Trying to delete skill with an existing ID? => stage skill to be deleted
        if((typeof(tmpSkills[idx].skill_id) !== 'undefined')){
            setSkillToDelete([...skillsToDelete, {skill_id: tmpSkills[idx].skill_id}]);
        } 
        tmpSkills.splice(idx, 1);
        setSkills({values: tmpSkills});
        setEdited(true);
    }

    // ----------- [END] Skill Handlers -------------------

    // Format edit hooks to be sent in POST request
    const handleSave = () => {
        // Location
        if(info.location === null && location){
            setLocationToCreate([location]);
        } else if(info.location !== location){
            setLocationToUpdate([...locationToUpdate, location]);
        }
        // Bio
        if(info.bio === null && bio){
            setBioToCreate([bio]);
        } else if(info.bio !== bio){
            setBioToUpdate([...bioToUpdate, bio]);
        }
        // Hobbies: 
        // No ID? => CREATE new hobby
        // Existing ID? => UPDATE existing hobby
        hobbies.values.forEach((row, idx) => {
            //console.log(`Row: ${row.hobby}, IDX: ${idx}`);
            if( !(typeof(row.hobby_id) !== 'undefined')){
                setHobbiesToCreate(hobbiesToCreate => [...hobbiesToCreate, {hobby: row.hobby, rowIdx: idx}]);
            } else if(typeof(row.updated) !== 'undefined'){
                setHobbiesToUpdate(hobbiesToUpdate => [...hobbiesToUpdate, {hobby_id: row.hobby_id, hobby: row.hobby, rowIdx: idx}]);
            }
        })
        // Skills: 
        // No ID? => CREATE new skill
        // Existing ID? => UPDATE existing skill
        skills.values.forEach((row, idx) => {
            //console.log(`Row: ${row.skill}, IDX: ${idx}`);
            if( !(typeof(row.skill_id) !== 'undefined')){
                setSkillsToCreate(skillsToCreate => [...skillsToCreate, {skill: row.skill, rowIdx: idx}]);
            } else if(typeof(row.updated) !== 'undefined'){
                setSkillsToUpdate(skillsToUpdate => [...skillsToUpdate, {skill_id: row.skill_id, skill: row.skill, rowIdx: idx}]);
            }
        })

        setShow(false);
        // Bad, but working method for triggering useEffect
        return showLogs ? setShowLogs(false) : setShowLogs(true);
    };


    // Handle POST requests for elements that have been staged
    useEffect(() => {

        if(locationToUpdate.length){
            //console.log(`** UPDATE Location: ${locationToUpdate}`);
            //console.log(`UserID: ${user}`)
            props.updateLocation(locationToUpdate, user.user_id);
            // Not actually updated here, yet
            setLocationToUpdate([]);
            console.log("Removed locationToUpdate. Sending to profile.jsx now...");
        } else if(locationToCreate.length){

        }


        if(bioToUpdate.length) {
            //console.log(`** UPDATE Bio: ${bioToUpdate}`);
            props.updateBio(bioToUpdate, user.user_id);
            setBioToUpdate([]);
            console.log("Removed bioToUpdate. Sending to profile.jsx now...")
        } else if(bioToCreate.length){

        }
        

        if(hobbiesToCreate.length) {
            const createHobbies = async() => {
                var newHobbies = [];
                for await (let hobbyToCreate of hobbiesToCreate){
                    const data = await props.createHobby(user.user_id, hobbyToCreate.hobby, hobbyToCreate.rowIdx);
                    //console.log("About.jsx Recieved Data from Profile.jsx:", data);
                    newHobbies.push(data);
                }
                //console.log("[About.jsx] Newly Created Hobbies: ", newHobbies);
                props.setCreatedHobbies(newHobbies);
            }
            createHobbies();
        }
        if(hobbiesToUpdate.length) {
            //console.log(`** UPDATE Hobbies: ${hobbiesToUpdate}`);
            hobbiesToUpdate.forEach((row, rowIdx) => {
                // console.log("Hobby Row Idx:", row.rowIdx);
                // console.log("Hobby ID:", row.hobby_id);
                // console.log("Hobby:", row.hobby);
                props.updateHobby(row.hobby_id, row.hobby, user.user_id, row.rowIdx);
            })
            setHobbiesToUpdate([]);
            console.log("HobbiesToUpdate:", hobbiesToUpdate);
        };


        if(skillsToCreate.length) {
            //console.log(`** CREATE Skills: ${skillsToCreate}`);
            const createSkills = async() => {
                var newSkills = [];
                for await (let skillToCreate of skillsToCreate){
                    const data = await props.createSkill(user.user_id, skillToCreate.skill, skillToCreate.rowIdx);
                    //console.log("About.jsx Recieved Data from Profile.jsx:", data);
                    newSkills.push(data);
                }
                //console.log("[About.jsx] Newly Created skills: ", newSkills);
                props.setCreatedSkills(newSkills);
            }
            createSkills();
        }
        if(skillsToUpdate.length) {
            //console.log(`** UPDATE Skills: ${skillsToUpdate}`);
            skillsToUpdate.forEach((row, rowIdx) => {
                console.log("Skill Row Idx:", row.rowIdx);
                console.log("Skill ID:", row.skill_id);
                console.log("Skill:", row.skill);
                props.updateSkill(row.skill_id, row.skill, user.user_id, row.rowIdx);
            })
            setSkillsToUpdate([]);
            console.log("HobbiesToUpdate:", skillsToUpdate);
        };


        if(skillsToDelete.length) {
            //console.log(`** DELETE Skills with ID: ${skillsToDelete}`);
            const deleteSkills = async() => {
                for await (let skillToDelete of skillsToDelete){
                    await props.deleteSkill(skillToDelete.skill_id);
                }
            }
            deleteSkills();
        };
        if(hobbiesToDelete.length) {
            //console.log(`** DELETE Hobbies with ID: ${hobbiesToDelete}`);
            const deleteHobbies = async() => {
                for await (let hobbyToDelete of hobbiesToDelete){
                    await props.deleteHobby(hobbyToDelete.hobby_id);
                }
            }
            deleteHobbies();
        }

        // Reset all POST forms after any updates -- stops recalling?

    }, [showLogs])


    return(
        <div className="tab-container">
        
        <h2>{user.firstname} {user.lastname}</h2>
        <p>About</p>
        {props.data.ownedByUser 
        ? <PencilFill size={25} onClick={handleShow}/> 
        : null}
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
                    <AlertDismissible/>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
                        <label htmlFor="location"><b>Location</b></label>
                        <input type="text" className="form-control" id="location" defaultValue={info.location} onChange={e => {setLocation(e.target.value); setEdited(true);}}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio"><b>Bio</b></label>
                        <textarea className="form-control" rows="5" id="bio" defaultValue={info.bio} onChange={e => {setBio(e.target.value); setEdited(true);}}></textarea>
                    </div>
                    
                    <div className="form-group row ml-4">
                        <div className="form-group col text-center">
                            <label htmlFor="hobbies"><b>Hobbies</b></label>
                            {renderHobbiesForm()}
                            {hobbies.values.length < 6
                            ? <Button onClick={() => addHobby()} variant="outline-success" size="sm">Add Hobby</Button>
                            : null }
                        </div>  
                        <div className="form-group col text-center">
                            <label htmlFor="skills"><b>Skills</b></label>
                            {renderSkillsForm()}
                            {skills.values.length < 6
                            ? <Button onClick={() => addSkill()} variant="outline-success" size="sm">Add Skill</Button>  
                            : null }
                        </div>  
                    </div>
                </form>             
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => {
                    setShow(false); 
                    handleSave(); 
                    setEdited(false); 
                    setShowAlert(false);
                }}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
        <div className="info-container">
            <h4><b>Location:</b> {info.location}</h4>
            <br></br>
            <h4><b>Bio:</b> {info.bio}</h4>
            <br></br>
        </div>
        <div className="user-container">
            <h4><b>Hobbies:</b>
            {hobbiesData 
            ? hobbiesData.map((row, idx) => 
                <div key={idx}>
                    <p>{row.hobby}</p>
                </div>
            ) 
            : null}</h4>
            <br></br>
            <h4><b>Skills:</b>
            {skillsData 
            ? skillsData.map((row, idx) => 
                <div key={idx}>
                    <p>{row.skill}</p>
                </div>
            ) 
            : null}</h4>
        </div>
    </div>
    );
}