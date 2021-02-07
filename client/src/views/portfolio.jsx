import { useEffect, useState } from "react";

export const Portfolio = props => {
    console.log("Portfolio Recieved Props: ", props);
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
            fetch('http://localhost:5000/portfolio', {
                method: 'GET',
                headers: {user_id: user.user_id}, 
                mode: 'cors',
                credentials: 'include',
                withCredentials: true,
            })
            .then(response => response.json())
            .then(data => {
                setStateLocal({
                    data: data,
                    fetched: true,
                });
                console.log("Portfolio Component Recieved Response: ", data);
            })
        }
    }, [stateLocal, props.location])

    return(
        <>        
        <h3>Hey {user.firstname} {user.lastname}</h3>
        <p>Portfolio Page</p>
        <br></br>
        {stateLocal.data 
        ? stateLocal.data.map((row) => 
            <div>
                <p><b>Occupation:</b> {row.occupation}</p>
                <p><b>Organization:</b> {row.organization}</p>
                <p><b>From:</b> {row.from_when}</p>
                <p><b>To:</b> {row.to_when}</p>
                <br></br>
            </div>
        )
        : null } 
        

        </>
    );
}