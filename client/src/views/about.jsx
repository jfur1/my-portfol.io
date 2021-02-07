import { useState, useEffect } from "react";

export const About = props => {
    console.log("About Recieved Props: ", props);
    
    const info = props.location.state.about;
    const user = props.location.state.user;


    return(
        <>
        <h2>Hey {user.firstname} {user.lastname}</h2>
        <p>About Page</p>
        <br></br>
        <h2>Location: <h3>{info.location}</h3></h2>
        <h2>Bio: <h3>{info.bio}</h3></h2>
        </>
    );
}