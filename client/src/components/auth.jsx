class Auth {
    constructor(){
        this.authenticated = false;
    }

    login(email, password, next){

        const data = { email, password }

        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(data => data.json())
        .then(user => {

            if(typeof(user) === undefined || !user.authenticated){
                this.authenticated = false;
                return next();
            }
    
            // Only authenticate a user upon JSON response: {authenticated: true}
            this.authenticated = true;
            return next();
        })
        .catch((err) => console.log(err));
    }

    // User remains authenticated until they log out
    logout(cb){
        this.authenticated = false;
        cb();
    }

    isAuthenticated(){
        return this.authenticated;
    }
}

export default new Auth();