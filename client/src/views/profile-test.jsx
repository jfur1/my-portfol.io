import React, { useState, useContext } from 'react';
import { UserContext } from '../components/utils/context';

export const Login = () => {
    const [user, setUser] = useContext(UserContext);

    return(
        <div>
            <h2>{user}</h2>
        </div>
    )
}