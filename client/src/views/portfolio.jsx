export const Portfolio = props => {
    //console.log("Portfolio: ", props);
    const user = props.location.state;

    return(
        <>
        <h3>Hey {user.firstname} {user.lastname}</h3>
        <p>Portfolio Content</p>
        </>
    );
}