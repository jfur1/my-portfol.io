export const ValidateRegistration = (credentials) => {
    const {
        firstname,
        lastname,
        username,
        email,
        password,
        passwordCheck,
    } = credentials;

    let errors = [];

    if (!firstname) {
        errors.push("Please enter your first name!");
      }
    if (!lastname) {
        errors.push("Please enter your last name!");
    }
    if (!email) {
        errors.push("Please enter your email Address!");
    }
    if(!username){
        errors.push("Please enter a username!");   
    }
    if(typeof username !== 'undefined'){
        var usernamePattern = new RegExp(/^[a-zA-Z0-9_.-]*$/i);
        if(!usernamePattern.test(username)){
            errors.push("Usernames can only contain letters, numbers, dashes, and underscores!");
        }
    }
    if (typeof email !== 'undefined') {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(email)) {
            errors.push("Please enter valid email address!");
        }
    }
    if (!password) {
        errors.push("Please enter a password!");
    }
    if (!passwordCheck) {
        errors.push("Please confirm your password!");
    }
    if (typeof password !== "undefined" && typeof passwordCheck !== "undefined") {
        if (password !== passwordCheck) {
            errors.push("Passwords must match!");
        }
    }
    
    return errors;
}