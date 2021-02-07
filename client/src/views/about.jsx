export const About = props => {
    console.log("About Recieved Props: ", props);
    const user = props.location.state.user;


    return(
        <>
        <h3>Hey {user.firstname} {user.lastname}</h3>
        <p>About Page</p>
        </>
    );
}