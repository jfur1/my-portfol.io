import { useEffect, useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Modal, Button } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert'

export const About = props => {
    console.log("About Recieved Props: ", props);
    
    // User Data
    const info = (props.location.state.about !== null) ? props.location.state.about : props.data.about;
    const user = (props.location.state.user !== null) ? props.location.state.user : props.data.user;
    const hobbiesData = (props.location.state.hobbies !== null) ? props.location.state.hobbies : props.data.hobbies;
    const skillsData = (props.location.state.skills !== null) ? props.location.state.skills : props.data.skills;

    // Edit Data
    const [show, setShow] = useState(false);
    //const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSave = () => setShow(false);
    // const handleSave = () => {
    //  if(edited){
    //      await fetch(...)
    //      setShow(false);
    //      setEdited(false);
    //  } else{
    //      setShow(false);    
    //  }
    //}
    const [showAlert, setShowAlert] = useState(false); 
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
                <Button onClick={() => {setShow(false); handleSave(); setEdited(false); setShowAlert(false);}} variant="outline-success">
                    Save Changes
                </Button>
                <Button onClick={() => {setShow(false); setEdited(false); setShowAlert(false);}} variant="outline-danger">
                    Exit
                </Button>
              </div>
            </Alert>
          </>
        );
    }

    const handleClose = () => {
        if(edited){
            //if(yes) => setShow(false);
            //else => (closeMsg);
            setShowAlert(true);
        } else{
            setShow(false);    
        }
    }

    const [edited, setEdited] = useState(false);
    const [location, setLocation] = useState(info.location);
    const [bio, setBio] = useState(info.bio);

    const [hobbies, setHobbies] = useState({values: hobbiesData});
    const [skills, setSkills] = useState({values: skillsData});
    // console.log("Hobbies Data:", hobbiesData);
    // console.log("Hobbies State:", hobbies);

    const renderHobbiesForm = () => {
        return hobbies.values.map((row, idx) =>
            <div className="form-group row" key={idx}>
                {console.log(row)}
                <input type="text" className="form-control" style={{width: '70%'}} value={row.hobby || ''} onChange={e => {handleHobbyChange(e, idx)}}/>
                <input type="button" value="Delete" onClick={() => removeHobby(idx)}/>
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
        setHobbies({values: tmpHobbies});
        setEdited(true);
    }

    const addHobby = () => {
        setHobbies({values: [...hobbies.values, '']});
    }

    const removeHobby = (idx) => {
        let tmpHobbies = [...hobbies.values];
        tmpHobbies.splice(idx, 1);
        setHobbies({values: tmpHobbies});
    }

    const renderSkillsForm = () => {
        return skills.values.map((row, idx) =>
            <div className="form-group row" key={idx}>
                {console.log(row)}
                <input type="text" className="form-control" style={{width: '70%'}} value={row.skill || ''} onChange={e => {handleSkillChange(e, idx)}}/>
                <input type="button" value="Delete" onClick={() => removeSkill(idx)}/>
            </div>
        )
    }
    const handleSkillChange = (event, idx) => {
        let tmpSkills = [...skills.values];
        tmpSkills[idx] = {
            skill_id: skills.values[idx].hobby_id, 
            uid: skills.values[idx].uid ,
            skill: event.target.value
        };
        setSkills({values: tmpSkills});
        setEdited(true);
    }
    const addSkill = () => {
        setSkills({values: [...skills.values, '']});
    }

    const removeSkill = (idx) => {
        let tmpSkills = [...skills.values];
        tmpSkills.splice(idx, 1);
        setSkills({values: tmpSkills});
    }

    return(
        <div className="tab-container">
        
        <h2>{user.firstname} {user.lastname}</h2>
        <p>About Page</p>

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
                        <input type="text" className="form-control" id="location" defaultValue={location} onChange={e => {setLocation(e.target.value); setEdited(true);}}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio"><b>Bio</b></label>
                        <textarea className="form-control" rows="5" id="bio" defaultValue={bio} onChange={e => {setBio(e.target.value); setEdited(true);}}></textarea>
                    </div>
                    
                    <div className="form-group row ml-4">
                        <div className="form-group col">
                            <label htmlFor="hobbies"><b>Hobbies</b></label>
                            {renderHobbiesForm()}
                            {hobbies.values.length < 6
                            ? <input type='button' value="Add Hobby" onClick={() => addHobby()}/>  
                            : null }
                        </div>  
                        <div className="form-group col">
                            <label htmlFor="skills"><b>Skills</b></label>
                            {renderSkillsForm()}
                            {skills.values.length < 6
                            ? <input type='button' value="Add Skill" onClick={() => addSkill()}/>  
                            : null }
                        </div>  
                    </div>
                </form>             
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleSave}>Save Changes</Button>
            </Modal.Footer>
        </Modal>

        <div className="info-container">
            {/* <h4><b>Edited? :</b> {edited ? "True" : "False"}</h4> */}
            <h4><b>Location:</b> {location}</h4>
            <br></br>
            <h4><b>Bio:</b> {bio}</h4>
            <br></br>
        </div>

            <div className="info-container">
                <h4><b>Hobbies:</b>
                {hobbies 
                ? hobbies.values.map((row, idx) => 
                    <div key={idx}>
                        <p>{row.hobby}</p>
                    </div>
                ) 
                : null}</h4>

                <h4><b>Skills:</b>
                {skills 
                ? skills.values.map((row, idx) => 
                    <div key={idx}>
                        <p>{row.skill}</p>
                    </div>
                ) 
                : null}</h4>
            </div>
        </div>
    );
}