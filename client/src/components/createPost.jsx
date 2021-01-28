export const createPost = (post) => {
    console.log(post);
    fetch('http://localhost:5000/createPost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post)
    })
    .then(res => res.json())
    .then(data => {
        console.log("User Data Recieved by Client: ", data);
        return;
    })
    .catch((err) => console.log(err));
}