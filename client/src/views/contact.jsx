import { useEffect, useState } from "react";
import {useSpring, animated, interpolate} from 'react-spring';

export const Contact = props => {
    console.log("Contact Recieved Props: ", props);
    const user = props.location.state.user;
    
    const [stateLocal, setStateLocal] 
    = useState({ 
        fetched: false, 
        data: null,
    })

    const {o, xyz, color} = useSpring({
    from: {o: 0, xyz: [0, 0, 0], color: 'black'},
    o: 1,
    xyz: [10, 20, 5],
    color: 'black'
    });

    useEffect(() => {
        if(props.location.state && !stateLocal.fetched){
            // Try and GET user profile data for the given profile
            fetch('http://localhost:5000/contact', {
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
                console.log("Contact Component Recieved Response: ", data);
            })
        }
    },[stateLocal, props.location])

    return(
        <>
        <animated.div
            style={{
            // If you can, use plain animated values like always, ...
            // You would do that in all cases where values "just fit"
            color,
            // Unless you need to interpolate them
            background: o.interpolate(o => `rgba(166, 255, 249, ${o})`),
            // Which works with arrays as well
            transform: xyz.interpolate((x, y, z) => `translate3d(${x}px, ${y}px, ${z}px)`),
            // If you want to combine multiple values use the "interpolate" helper
            border: interpolate([o, color], (o, c) => `${o * 10}px solid ${c}`),
            // You can also form ranges, even chain multiple interpolations
            padding: o.interpolate({range: [0, 0.5, 1], output: [0, 0, 10]}).interpolate(o => `${o}%`),
            // Interpolating strings (like up-front) through ranges is allowed ...
            borderColor: o.interpolate({range: [0, 1], output: ['#a6fff9', '#a6fff9']}),
            // There's also a shortcut for plain, optionless ranges ...
            opacity: o.interpolate([0.1, 0.2, 0.6, 1], [1, 0.1, 0.5, 1])
            }}
        >
            <h2>{user.firstname} {user.lastname}</h2>
            <p>Welcome to your personalized contact page!</p>

            <p><b>Email: </b>{user.email}</p>
            <br></br>
            {stateLocal.data 
            ? stateLocal.data.map((row) => 
                <div>
                    <p><b>Link:</b> {row.link}</p>
                    <br></br>
                </div>
            )
            : null } 
        </animated.div>
        </>
    );
}