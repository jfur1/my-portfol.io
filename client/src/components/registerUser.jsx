export const registerUser = (credentials, next) => {
    console.log('credentials: ', credentials);
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
        if(typeof(data.registered) == undefined || !data.registered){
            console.log("Server Error: Failed to Register!");
            next();
            return;
        }

        next();
        return;
    })
    .catch((err) => {
        console.error('Error:', err);
    });

}