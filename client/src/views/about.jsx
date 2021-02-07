export const About = props => {
    console.log("About Recieved Props: ", props);
    
    const info = (props.location.state.about !== null) ? props.location.state.about : props.data.about;
    const user = (props.location.state.user !== null) ? props.location.state.user : props.data.user;


    return(
        <>
        <h2>Hey {user.firstname} {user.lastname}</h2>
        <p>About Page</p>
        <br></br>
        <h2><b>Location:</b> {info.location}</h2>
        <br></br>
        <h2><b>Bio:</b> {info.bio}</h2>
        </>
    );
}