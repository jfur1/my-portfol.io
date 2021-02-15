import { useEffect, useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Modal, Button } from 'react-bootstrap';
import { AlertDismissible } from '../components/alertDismissible';

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
    
    const [skillsToDelete, setSkillToDelete] = useState([]);
    const [hobbiesToDelete, setHobbyToDelete] = useState([]);

    const [showLogs, setShowLogs] = useState(false);

    // After successful post request, profile.jsx updates state with new data
    // New data passed to hobbiesData/skillsData, and is copied into hobbies/skills hooks
    // where data can be manipulated by user
    useEffect(() => {
        //setLocationToCreate([]);
        //setBioToCreate([]);
        setHobbies({values: hobbiesData});
        setSkills({values: skillsData});
        setHobbyToDelete([]);
        setSkillToDelete([]);
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
        if((typeof(tmpHobbies[idx].hobby_id) !== 'undefined')
        && !(typeof(tmpHobbies[idx].toUpdate) !== 'undefined')){
            tmpHobbies[idx].toUpdate = true;
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
        if((typeof(tmpSkills[idx].skill_id) !== 'undefined')
        && !(typeof(tmpSkills[idx].toUpdate) !== 'undefined')){
            tmpSkills[idx].toUpdate = true;
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

    // Format edit hooks to be sent in POST request
    const handleSave = () => {
        // Location
        let locationToCreate = [];
        let locationToUpdate = [];
        
        if(info.location === null && location){
            locationToCreate.push(location);
        } else if(info.location !== location){
            //console.log(`Set location update from: ${info.location} to: ${location}`);
            locationToUpdate.push(location);
        }

        let bioToCreate = [];
        let bioToUpdate = [];
        // Bio
        if(info.bio === null && bio){
            bioToCreate.push(bio);
        } else if(info.bio !== bio){
            //console.log(`Set bio update from: ${info.bio} to: ${bio}`);
            bioToUpdate.push(JSON.stringify(bio).replace(/['"]+/g, ''));
        }

        var hobbiesToCreate = [];
        var hobbiesToUpdate = [];
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

        var skillsToCreate = [];
        var skillsToUpdate = [];
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

        if(locationToUpdate.length){
            props.updateLocation(locationToUpdate[0], user.user_id);
            locationToUpdate = [];
        } else if(locationToCreate.length){

        }

        if(bioToUpdate.length) {
            props.updateBio(bioToUpdate[0], user.user_id);
            bioToUpdate = [];
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
                props.updateHobby(row.hobby_id, row.hobby, user.user_id, row.rowIdx);
            })
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
                props.updateSkill(row.skill_id, row.skill, user.user_id, row.rowIdx);
            })
            console.log("HobbiesToUpdate:", skillsToUpdate);
        };


        if(skillsToDelete.length) {
            //console.log(`** DELETE Skills with ID: ${skillsToDelete}`);
            const deleteSkills = async() => {
                for await (let skillToDelete of skillsToDelete){
                    await props.deleteSkill(skillToDelete.skill_id);
                }
                props.reloadProfile();
            }
            deleteSkills();
        };

        if(hobbiesToDelete.length) {
            //console.log(`** DELETE Hobbies with ID: ${hobbiesToDelete}`);
            const deleteHobbies = async() => {
                for await (let hobbyToDelete of hobbiesToDelete){
                    await props.deleteHobby(hobbyToDelete.hobby_id);
                }
                props.reloadProfile();
            }
            deleteHobbies();
        }

        setShow(false);
        // Bad, but working method for triggering useEffect
        return showLogs ? setShowLogs(false) : setShowLogs(true);
    };

    function NewlineText(props) {
        const text = props.text;
        return text.split("\\n").map((str, idx) => 
            <div key={idx}>{str.length === 0 ? <br/> : str}</div>
        );
    }

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
                <form>
                    
                    <div className="form-group">
                        <label htmlFor="location"><b>Location</b></label>
                        <input type="text" className="form-control" id="location" defaultValue={info.location} onChange={e => {setLocation(e.target.value); setEdited(true);}}></input>
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio"><b>Bio</b></label>
                        
                        <textarea className="form-control" rows="5" id="bio" 
                        defaultValue={info.bio.replace(/\\n/g, '\n') || ''} 
                        onChange={e => {setBio(e.target.value); setEdited(true);}}>

                        </textarea>
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
            <div className="draggable-container">
                <h4><b>Location:</b> {info.location}</h4>
            </div>
            <br></br>
            <div className="draggable-container">
                <h4><b>Bio:</b></h4>
            <><NewlineText text={info.bio}/></>
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