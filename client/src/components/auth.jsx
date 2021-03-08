class Auth {
    constructor(){
        this.authenticated = false;
        this.user = {
            user_id: null,
            firstname: null,
            lastname: null,
            email: null,
            username: null,
        }
    }

    login(email, password, next){

        const data = { email, password };


        fetch('/api/login', {
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

            //console.log("User Recieved by /auth : ", user);
            
            if(!(typeof user !== 'undefined') || !user["authenticated"]){
                this.authenticated = false;
                return next({error: true});
            }
            else{
                // Only authenticate a user upon JSON response: {authenticated: true}
                this.authenticated = true;
                this.user = user.data;
                return next(user.data);
            }
        })
        .catch((err) => console.log(err));
    }

    // User remains authenticated until they log out
    logout(next){
        fetch('/api/logout', {
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