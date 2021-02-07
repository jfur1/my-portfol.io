const express = require("express");
var cors = require('cors');
const bcrypt = require('bcryptjs');
var db = require("./config/db");
const session = require('express-session');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Express
const app = express();

// Middleware
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json()); //req.body
app.use(express.urlencoded({extended: false}));

// --------------------------- BEGIN Passport.js Middleware ---------------------

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
                    //console.log("Passport Middleware User: ", user);
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
        //console.log("Deserialized User");
        done(null, res);
    })
    .catch((err) => {
        console.log(err);
    });
});

// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 60*60*1000
    }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// ------------------------ END Passport.js Middleware ------------------------------

// Routes

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

         if (data == null) {
            console.log('No users registered with that email!');
            res.json({authenticated: false});
            return;
        } else {
            passport.authenticate('local', (err, user) => {
                if(err) console.log(err);
                req.logIn(user, (err) => {
                    if(err) console.log(err);
                    if(req.isAuthenticated()){

                        return res.json({
                            authenticated: true, 
                            data: {
                                user_id: req.user.user_id,
                                firstname: req.user.first_name,
                                lastname: req.user.last_name,
                                username: req.user.username,
                                email: req.user.email
                            }
                        });
                    }
                    else{
                        return res.json({authenticated: false});
                    }
                });
            })
            (req, res, next);
        }
    })
    .catch(err => {
      console.log(err);
    });
});

// Logout
app.post('/logout', (req, res) => {
    req.logout();
    console.log("You logged out");
    res.json({authenticated: false});
    return;
});

app.get('/getData', ensureAuthenticated, (req, res) => {
    db.tx(t => {
        return t.any('SELECT * FROM users;');
    })
    .then((d) => {
        console.log("Successfully returned users table!");
        return res.json(d);
    })
    .catch((err) => console.log(err));
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
        //console.log(req.session);
        // console.log("Req.user: ", req.user);
        // console.log("User Auth? :", req.isAuthenticated());
        return next(); 
    }
    console.log("Invalid Session -- Could not authenticate client cookie");
    console.log(req.session);

    res.json({authenticated: false});
}

app.get('/getUserData', (req, res) => {
    const username = req.headers.username;
    //console.log("Server recieved header:", username);

    db.tx(t => {
        return t.oneOrNone('SELECT * FROM users WHERE \'' + username + '\' = username;');
    })
    .then((user) => {
        if(!(typeof user !== 'undefined')){
            console.log("Could find user: ", username);
            return res.json({error: true});
        }
        else{
            //console.log("server returning user: ", user)
            return res.json({
                user: {
                    user_id: user.user_id,
                    firstname: user.first_name,
                    lastname: user.last_name,
                    username: user.username,
                    email: user.email,
                },
                requestedBy: req.user
            });
        }
    })
    .catch((err) => {
        console.log(err);
        res.json({
            error: true,
            requestedBy: req.user
        })
    });
})

app.post('/createPost', (req, res) => {

    const {
        user_id,
        username,
        post
    } = req.body;

    db.task(async t => {
        const max_id = await t.one('SELECT MAX(pid) FROM post;');
        
        if(max_id !== null){
            const newPostId = max_id.max + 1;
            const logs = await t.none('INSERT INTO post (pid, body, uid, author) VALUES ($1, $2, $3, $4)', 
            [newPostId, post, user_id, username]);
            res.json({status: "success"});
        }
        else{
            res.json({status: "failed"});
        }
    })
    .then(() => {
        return;
    })
    .catch((err) => console.log(err));
});

app.get('/getPosts', (req, res) => {
    const username = req.headers.username;
    //console.log("Attempting to get posts for user:", username);

    db.tx(t => {
        return t.any('SELECT * FROM post WHERE \''+ username +'\' = author;');
    })
    .then((posts) => {
        return res.json({posts});
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true});
    });
    
})

app.get('/about', (req, res) => {
    const username = req.headers.username;
    
    db.task(async t => {
        const user = await t.one('SELECT user_id FROM users WHERE \''+ username + '\' = username;');
        return t.oneOrNone('SELECT * FROM profile WHERE \''+ user.user_id + '\' = uid;');
    })
    .then((about) => {
        return res.json(about);
    })
    .catch((err) => console.log(err));

})

app.get('/portfolio', (req, res) => {
    const username = req.headers.username;
    
    db.tx(async t => {
        const user = await t.one('SELECT user_id FROM users WHERE \''+ username + '\' = username;');
        return t.any('SELECT * FROM portfolio WHERE uid = $1', user.user_id);
    })
    .then((portfolio) => {
        return res.json(portfolio);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true});
    });

})

app.get('/contact', (req, res) => {
    const username = req.headers.username;

    db.tx(async t => {
        const user = await t.one('SELECT user_id FROM users WHERE \''+ username + '\' = username;');
        return t.any('SELECT * FROM links WHERE \''+ user.user_id +'\' = uid;');
    })
    .then((links) => {
        return res.json(links);
    })
    .catch((err) => console.log(err));

})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port ' + PORT));