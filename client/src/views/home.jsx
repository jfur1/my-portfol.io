// Home Tab on a User's Profile
import { PencilFill } from 'react-bootstrap-icons';

export const Home = (props) => {
    console.log("Home Component Recieved Props: ", props);
    const user = props.data.user;

    return(
        <div className="tab-container"> 

            <h2>{user.firstname} {user.lastname} </h2>
            <p>Home</p>

            {props.data.ownedByUser ? <PencilFill size={25} onClick={() => console.log("click")}/> : null}
            
            <div className="info-container">

            <p><b>Username:</b> {user.username}</p>
            <p><b>Email: </b>{user.email}</p>
            </div>

        </div>
    )
}