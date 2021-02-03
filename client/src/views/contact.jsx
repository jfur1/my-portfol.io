export const Contact = props => {
    console.log("Contact Recieved Props: ", props);
    const user = props.location.state.user;

    return(
        <>
        <h3>Hey {user.firstname} {user.lastname}</h3>
        <p>Contact Page</p>
        </>
    );
}