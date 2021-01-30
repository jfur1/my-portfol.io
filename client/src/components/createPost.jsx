export const createPost = (post, user, next) => {
    //console.log(post);
    // Clean data -- so we can send as one JSON object
    user["post"] = post["newPost"];
    //console.log(user);
    fetch('http://localhost:5000/createPost', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
        mode: 'cors',
        credentials: 'include',
        withCredentials: true
    })
    .then(res => res.json())
    .then(data => {
        //console.log("Create Post Response: ", data);
        if(typeof data["status"] !== 'undefined' && data["status"] === true){
            return next(true);
        }
        else{
            return next(false);
        }
    })
    .catch((err) => console.log(err));
}