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
    } else if(password.length < 7){
        errors["passwordLength"] = "Password must be at least 8 characters.";
    } else if(password.length > 19){
        errors["passwordLength"] = "Password must be less than 20 characters.";
    }
    if(username === ""){
        errors["username"] = "Please enter a username.";
    }
    if(passwordCheck === ""){
        errors["passwordCheck"] = "Please confirm your password.";
    }
    else if(passwordCheck !== password){
        errors["noMatch"] = "Passwords do not match!";
    }

    return errors;
}