import { Validated } from '../newRegistration/Validated';

function length(obj) {
    if((!(typeof(obj) !== 'undefined')) || (obj == null)) return 0;
    return Object.keys(obj).length;
}


export const registerUser = (credentials, next) => {
    const errors = Validated(credentials);
    
    if(length(errors) > 0){
        return next({failedAttempt: true, errors: errors});
    }
    else{
        fetch('/api/newUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })
        .then(response => response.json())
        .then(data => {
            return next(data);
        })
        .catch((err) => {
            console.error('Error:', err);
        });
    }
}