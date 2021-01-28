export const getUserData = () => {

    fetch('http://localhost:5000/getUserData', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("User Data Recieved by Client: ", data);
        return;
    })
    .catch((err) => console.log(err));
    

}