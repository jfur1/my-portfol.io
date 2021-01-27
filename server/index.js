const express = require("express");
var cors = require('cors');
const bcrypt = require('bcryptjs');
var db = require("./config/db");
const path = require('path');
const session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); //req.body
app.use(express.urlencoded({extended: false}));

// ------------------------------------------ BEGIN Passport.js Middleware ---------------------------------------

// Passport Config
passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        console.log('Made it to auth!');

        // Match User
        db.tx(t => {
            return t.oneOrNone('SELECT * FROM users WHERE \'' + email + '\' = email;');
        })
        .then((rows) => {
            const user = rows;
            if (!user) {
                console.log('Wrong email!');
                return done(null, false, { message: 'That email is not registered' });
            }

            // Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    throw err;
                }

                if (isMatch) {
                    console.log('Made it past username and password checks!');
                    return done(null, user);
                } else {
                    console.log('Wrong password!');
                    return done(null, false, { message: 'Password incorrect' });
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
}));

// Passport Serialize/Deserialize
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser((user_id, done) => {
    db.tx(t => {
        return t.one('SELECT * FROM users WHERE \'' + user_id + '\' = user_id;');
    })
    .then((res) => {
        done(null, res);
    })
    .catch((err) => {
        console.log(err);
    });
});

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// ------------------------------------------ END Passport.js Middleware ------------------------------------------


// Routes

app.get('/getData', function(req, res){
    db.tx(t => {
        return t.any('SELECT * FROM users;');
    })
    .then((d) => {
        console.log("Successfully returned users table!");
        res.json(d);
    })
});


app.post('/newUser', async(req, res) => {
    console.log('Request Body Recieved by the Server: \n' , req.body);
    const {
        firstname,
        lastname,
        username,
        email,
        password
    } = req.body;

    db.task(async t => {
        const email_check = await t.oneOrNone('SELECT * FROM users WHERE \'' + email + '\' = email;');
        
        if(email_check !== null){
            console.log("Email Already Exists!");
            return false;
        }
        else{
            const max_id = await t.one('SELECT MAX(user_id) FROM users;');
            let newUserId = max_id.max;
            newUserId++;
            console.log("New User ID:", newUserId);
            
            // Hash Password
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Set password to hashed version
            // let hashedPassword = hash;
            console.log('Generated hashed password: ');
            console.log(hashedPassword);

            return t.none('INSERT INTO users (user_id, first_name, last_name, username, email, password) VALUES($1, $2, $3, $4, $5, $6)', 
            [
                newUserId,
                firstname,
                lastname,
                username,
                email,
                hashedPassword
            ])
        }
    })
    .then(data => {
        if(data === false){
            return res.json({isRegistered: false, failedAttempt: true, emailTaken: true});
        }

        console.log("Made it to register user callback.");
        return res.json({isRegistered: true, failedAttempt: false, emailTaken: false});
    })
    .catch((err) => {
        console.log(err);
        res.json({isRegistered: false, newUser: false, failedAttempt: true, emailTaken: false});
    })
})


app.post('/login', (req, res, next) => {
    const { email } = req.body;
    
    let errors = [];
    db.tx(t => {
        return t.oneOrNone('SELECT * FROM users WHERE \'' + email + '\' = email;');
    })
    .then((data) => {
        console.log("Secret: " + data);
         if (data == null) {
            console.log('No users registered with that email!');
            res.json({authenticated: false});
            return;
        } else {
            passport.authenticate('local', {
                successRedirect: '/passport-success',
                failureRedirect: '/passport-failure',
                failureFlash: false
            })(req, res, next);
        }
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/passport-success', (req, res) => {
    console.log("Passport Login Success!");
    res.json({authenticated: true});
    return;
});

app.get('/passport-failure', (req, res) => {
    console.log('Passoprt Login Failure!');
    res.json({authenticated: false});
    return;
})

// Logout
app.get('/logout', (req, res) => {
    req.logout();
    console.log("You logged out");
    res.json({authenticated: false});
    return;
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port ' + PORT));