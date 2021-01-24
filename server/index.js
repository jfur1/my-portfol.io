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

app.use(cors());
app.use(express.json()); //req.body
app.use(express.urlencoded({extended: true}));

// Passport Config
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

            //Check if user has verified their account via email
            //if(!user.verified){
           //     console.log("Confirm Email to Login"); // User has not verified email
            //    return done(null, false, { message: 'That email is not verified' });
            //}

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

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {

        res.redirect('/login');
    }
}

// Routes

app.get('/getData', loggedIn, function(req, res){
    db.tx(t => {
        return t.any('SELECT * FROM users;');
    })
    .then((d) => {
        console.log("Successfully returned users table!");
        res.json(d);
    })
});

app.get('/test', (req, res) => {
    console.log('hi');
})

/* 
    // using an ES7 syntax for the callback:
    db.task('my-task', async t {
            // t.ctx = task context object

            const user = await t.one('SELECT id FROM Users WHERE name = $1', 'John');
            return t.any('SELECT * FROM Events WHERE userId = $1', user.id);
        })
        .then(data => {
            // success
            // data = as returned from the task's callback
        })
        .catch(error => {
            // error
        });
*/

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
            return null;
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
        console.log("Made it to callback.");
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
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
            console.log("Email ")
            res.json(`No registed email matching ${email}`);
        } else {
            passport.authenticate('local', {
                successRedirect: '/getData',
                failureRedirect: '/',
                failureFlash: false
            })(req, res, next);
        }
    })
    .catch(err => {
      console.log(err);
    });
});

// Logout
app.get('/logout', (req, res) => {
    req.logout();
    console.log("You logged out");
    res.redirect('/login');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port ' + PORT));