export const About = props => {
    console.log("About Recieved Props: ", props);
    
    const info = (props.location.state.about !== null) ? props.location.state.about : props.data.about;
    const user = (props.location.state.user !== null) ? props.location.state.user : props.data.user;
    const hobbies = (props.location.state.hobbies !== null) ? props.location.state.hobbies : props.data.hobbies;
    const skills = (props.location.state.skills !== null) ? props.location.state.skills : props.data.skills;

    return(
        <>
        
        <h2>Hey {user.firstname} {user.lastname}</h2>
        <h4>About Page</h4>
        <br></br>
        <div className="user-container">
        <h4><b>Location:</b> {info.location}</h4>
        <br></br>
        <h4><b>Bio:</b> {info.bio}</h4>
        <br></br>
        </div>

        <div className="user-container">
        <h4><b>Hobbies:</b>
        {hobbies 
        ? hobbies.map((row, idx) => 
            <div key={idx}>
                <p>{row.hobby}</p>
            </div>
        ) 
        : null}</h4>

        <h4><b>Skills:</b>
        {skills 
        ? skills.map((row, idx) => 
            <div key={idx}>
                <p>{row.skill}</p>
            </div>
        ) 
        : null}</h4>
        </div>
        </>
    );
}