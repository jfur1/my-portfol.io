import { ValidateRegistration } from './validateRegistration';

export const registerUser = (credentials, props, next) => {
    //console.log('props: ', props.history);

    const errors = ValidateRegistration(credentials);
    
    // console.log("ValidateRegistration Resposne: ", validated);
    // console.log("ValidatedRegistration errors: ", errors);

    if(errors.length){
        console.log("Invalid Registration!");
        console.log("Errors: ", errors);
        return next({data: {isRegistered: false, failedAttempt: true}, errors: errors});
    }

    fetch('http://localhost:5000/newUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    })
    .then(response => response.json())
    .then(data => {

        console.log('Response:', data);
        if(data.emailTaken){
            errors.push("Email already taken!");
            return next({data: data, errors: errors});
        }

        else if(typeof(data.isRegistered) == undefined || !data.isRegistered){
            console.log("Server Error: Failed to Register!");
            errors.push("Server error! Failed to register.");
            return next({data: data, errors: errors});
        }
    
    return next({data: data, errors: errors});
    })
    .catch((err) => {
        console.error('Error:', err);
    });

}