export const Validated = (credentials) => {
    const {
        fullname,
        email,
        username,
        password,
        passwordCheck
    } = credentials;

    let errors = {};

    if (fullname === "") {
        errors["fullname"] = "Please enter your full name.";
    }
    if (fullname.length > 49) {
        errors["fullnameLength"] = "Full name must be less than 50 characters.";
    }
    if (email === "") {
        errors["email"] = "Please enter an email address.";
    }
    if (email !== '') {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(email)) {
            errors["invalidEmail"] = "Please enter a valid email address.";
        }
    }
    if (password === "") {
        errors["password"] = "Please enter a password.";
    } else if(password.length < 7 || password.length > 19){
        errors["passwordLength"] = "Password must be between 8 and 20 characters.";
    } 

    if(username === ""){
        errors["username"] = "Please enter a username.";
    } else if(username.length < 7 || username.length > 49){
        errors["usernameLength"] = "Username must be between 8 and 50 characters."
    } else{
        var regexp = /^[a-zA-Z0-9-_]+$/;
        if(!username.serach(regexp)){
            errors["invalidUsername"] = "Username can only contrain alphanumeric values, dashes, or underscores."
        }
    }

    if(passwordCheck === ""){
        errors["passwordCheck"] = "Please confirm your password.";
    }
    else if(passwordCheck !== password){
        errors["noMatch"] = "Passwords do not match!";
    }

    return errors;
}