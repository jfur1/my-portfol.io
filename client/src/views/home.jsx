// Home Tab on a User's Profile

export const Home = (props) => {
    //console.log("Home Component Recieved Props: ", props);
    const user = props.data.user;

    return(
        <div className="tab-container"> 
            
            {(user !== null && typeof user !== 'undefined')
            ? 
                <>
                <h3>{user.fullname}</h3>

                <br></br>

                <p><b>Username:</b> {user.username}</p>
                <p><b>Email: </b>{user.email}</p>
                <br></br>
                </> 

            : null}

        </div>
    )
}