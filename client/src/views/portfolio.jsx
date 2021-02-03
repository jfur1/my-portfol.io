export const Portfolio = props => {
    console.log("Portfolio Recieved Props: ", props);
    const user = props.location.state.user;

    return(
        <>
        <h3>Hey {user.firstname} {user.lastname}</h3>
        <p>Portfolio Page</p>
        </>
    );
}