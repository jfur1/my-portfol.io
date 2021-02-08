// Home Tab on a User's Profile
import { Card } from 'react-bootstrap'
import { PencilFill } from 'react-bootstrap-icons';

export const Home = (props) => {
    // User data passed via props.data -- NOT props.location.state
    console.log("Home Component Recieved Props: ", props);
    const user = props.data.user;

    return(
        <Card>
            <Card.Body>
                <br></br>
                <Card.Title>Home</Card.Title>
                {props.data.ownedByUser ? <PencilFill size={25} onClick={() => console.log("click")}/> : null}
                
                <br></br>
                
                {user !== null && typeof user !== 'undefined' ? 
                <><h3>{user.firstname} {user.lastname}</h3>
                <br></br>
                <p><b>Username:</b> {user.username}</p>
                <p><b>Email: </b>{user.email}</p>
                <br></br></> 
                : null}
            </Card.Body>
        </Card>
    )
}