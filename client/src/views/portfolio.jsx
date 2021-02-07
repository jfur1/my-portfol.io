import { useEffect, useState } from "react";

export const Portfolio = props => {
    console.log("Portfolio Recieved Props: ", props);
    const user = props.location.state.user;
    const info = props.location.state.portfolio;

    return(
        <>        
        <h3>Hey {user.firstname} {user.lastname}</h3>
        <p>Portfolio Page</p>
        <br></br>
        {info
        ? info.map((row) => 
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