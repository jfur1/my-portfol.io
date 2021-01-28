class Auth {
    constructor(){
        this.authenticated = false;
    }

    login(email, password, next){

        const data = { email, password };

        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify(data),
        })
        .then(data => data.json())
        .then(user => {

            console.log("User Recieved by /auth : ", user);

            if(typeof(user) === undefined || !user.authenticated){
                this.authenticated = false;
                return next({error: "Failure to Authneticate!"});
            }
    
            // Only authenticate a user upon JSON response: {authenticated: true}
            this.authenticated = true;
            return next(user.data);
        })
        .catch((err) => console.log(err));
    }

    // User remains authenticated until they log out
    logout(next){
        fetch('http://localhost:5000/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            mode: 'cors',
            credentials: 'include',
        })
        .then(data => data.json())
        .then((res) => {
            console.log("Logged Out.");
            this.authenticated = false;
            return next();
        })
        .catch((err) => console.log(err));
    }

    isAuthenticated(){
        return this.authenticated;
    }
}

export default new Auth();