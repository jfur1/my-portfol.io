import { useState, useEffect } from "react";

export const About = props => {
    console.log("About Recieved Props: ", props);
    const user = props.location.state.user;

    const [stateLocal, setStateLocal] 
    = useState({ 
        fetched: false, 
        bio: null, 
        location: null,
        user: null,
        data: null,
    })

    useEffect(() => {
        if(props.location.state && !stateLocal.fetched){
            // Try and GET user profile data for the given profile
            fetch('http://localhost:5000/about', {
                method: 'GET',
                headers: {user_id: user.user_id}, 
                mode: 'cors',
                credentials: 'include',
                withCredentials: true,
            })
            .then(response => response.json())
            .then(data => {
                setStateLocal({
                    bio: data.bio,
                    location: data.location,
                    fetched: true,
                });
                console.log("About Component Recieved Response: ", data);
            })
        }
    }, [stateLocal, props.location])



    return(
        <>
        <h2>Hey {user.firstname} {user.lastname}</h2>
        <p>About Page</p>
        <br></br>
        <h2>Location: <h3>{stateLocal.location}</h3></h2>
        <h2>Bio: <h3>{stateLocal.bio}</h3></h2>
        </>
    );
}