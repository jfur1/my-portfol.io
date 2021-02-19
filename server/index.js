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

            return t.none('INSERT INTO users (user_id, first_name, last_name, username, email, password) VALUES(${newUserId}, ${firstname}, ${lastname}, ${username}, ${email}, ${hashedPassword})', 
            {
                newUserId,
                firstname,
                lastname,
                username,
                email,
                hashedPassword
            })
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
        return t.oneOrNone('SELECT * FROM users WHERE ${email} = email;', {email});
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
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE \''+ username + '\' = username;');

        if(!user){
            return res.json({error: true});
        }

        return t.oneOrNone('SELECT * FROM profile WHERE \''+ user.user_id + '\' = uid;');
    })
    .then((about) => {
        return res.json(about);
    })
    .catch((err) => console.log(err));

})

app.get('/profile', (req, res) => {
    const username = req.headers.username;
    
    db.tx(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE \''+ username + '\' = username;');
        
        if(!user){
            return res.json({error: true});
        }

        return t.any('SELECT * FROM profile WHERE uid = $1', user.user_id);
    })
    .then((profile) => {
        return res.json(profile);
    })
    .catch((err) => {
        console.log(err);
        //res.json({error: true});
    });
})

app.get('/portfolio', (req, res) => {
    const username = req.headers.username;
    
    db.tx(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE \''+ username + '\' = username;');
        
        if(!user){
            return res.json({error: true});
        }

        return t.any('SELECT portfolio_id, uid, occupation, organization, from_when::varchar, to_when::varchar, description FROM portfolio WHERE uid = $1 ORDER BY position', user.user_id);
    })
    .then((portfolio) => {
        return res.json(portfolio);
    })
    .catch((err) => {
        console.log(err);
        //res.json({error: true});
    });

})

app.get('/contact', (req, res) => {
    const username = req.headers.username;

    db.tx(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE \''+ username + '\' = username;');

        if(!user){
            return res.json({error: true});
        }

        return t.any('SELECT * FROM links WHERE \''+ user.user_id +'\' = uid ORDER BY position;');
    })
    .then((links) => {
        return res.json(links);
    })
    .catch((err) => console.log(err));

})

app.get('/education', (req, res) => {
    const username = req.headers.username;

    db.tx(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE \''+ username + '\' = username;');

        if(!user){
            return res.json({error: true});
        }

        return t.any('SELECT education_id, uid, organization, education, from_when::varchar, to_when::varchar, description FROM education WHERE \''+ user.user_id +'\' = uid ORDER BY position;');
    })
    .then((eduaction) => {
        return res.json(eduaction);
    })
    .catch((err) => console.log(err));
})

app.get('/hobbies', (req, res) => {
    const username = req.headers.username;

    db.tx(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE \''+ username + '\' = username;');

        if(!user){
            return res.json({error: true});
        }

        return t.any('SELECT * FROM hobbies WHERE \''+ user.user_id +'\' = uid ORDER BY position;');
    })
    .then((hobbies) => {
        return res.json(hobbies);
    })
    .catch((err) => console.log(err));
})

app.get('/skills', (req, res) => {
    const username = req.headers.username;

    db.tx(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE \''+ username + '\' = username;');

        if(!user){
            return res.json({error: true});
        }

        return t.any('SELECT * FROM skills WHERE \''+ user.user_id +'\' = uid ORDER BY position;');
    })
    .then((skills) => {
        return res.json(skills);
    })
    .catch((err) => console.log(err));
})

app.get('/projects', (req, res) => {
    const username = req.headers.username;

    db.tx(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE \''+ username + '\' = username;');

        if(!user){
            return res.json({error: true});
        }

        return t.any('SELECT project_id, uid, title, description, organization, from_when::varchar, to_when::varchar, link, position FROM projects WHERE \''+ user.user_id +'\' = uid ORDER BY position;');
    })
    .then((skills) => {
        return res.json(skills);
    })
    .catch((err) => console.log(err));
})

// ----------- [BEGIN] Edit About Tab -----------

app.post('/createLocation', (req, res) => {
    const {user_id, location} = req.headers;

    db.task(async t => {
        const max_id = await t.one('SELECT MAX(profile_id) FROM profile;');
        let newId = max_id.max;
        newId++;

        return t.one('INSERT INTO profile (profile_id, uid, location) VALUES(${newId}, ${user_id}, ${location}) RETURNING profile_id, uid, location', 
        {
            newId,
            user_id,
            location
        })
    })
    .then((data) => {
        console.log("Inserted!");
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/createBio', (req, res) => {
    const {user_id, bio} = req.headers;

    db.task(async t => {
        const max_id = await t.one('SELECT MAX(profile_id) FROM profile;');
        let newId = max_id.max;
        newId++;

        return t.one('INSERT INTO profile (profile_id, uid, bio) VALUES(${newId}, ${user_id}, ${bio}) RETURNING profile_id, uid, bio', 
        {
            newId,
            user_id,
            bio
        })
    })
    .then((data) => {
        console.log("Inserted!");
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/createHobby', (req, res) => {
    const {user_id, hobby, position} = req.headers;

    db.task(async t => {
        const max_id = await t.one('SELECT MAX(hobby_id) FROM hobbies;');
        let newId = max_id.max;
        newId++;
        console.log(`NewID: ${newId}`);

        return t.one('INSERT INTO hobbies (hobby_id, uid, hobby, position) VALUES(${newId}, ${user_id}, ${hobby}, ${position}) RETURNING hobby_id, uid, hobby, position', 
        {
            newId,
            user_id,
            hobby,
            position
        })
    })
    .then((data) => {
        console.log("Inserted!");
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/createSkill', (req, res) => {
    const {user_id, skill, position} = req.headers;

    db.tx(async t => {
        const max_id = await t.one('SELECT MAX(skill_id) FROM skills;');
        let newId = max_id.max;
        newId++;

        return t.one('INSERT INTO skills (skill_id, uid, skill, position) VALUES(${newId}, ${user_id}, ${skill}, ${position}) RETURNING skill_id, uid, skill, position', 
        {
            newId,
            user_id,
            skill,
            position
        });
    })
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/updateLocation', (req, res) => {
    //console.log("Req.headers:", req.headers);
    const {user_id, location} = req.headers;
    //console.log("Server recieved user_id:", user_id);
    //console.log("Server recieved location:", location);

    db.tx(async t => {
        return t.one('UPDATE profile SET location = ${location} WHERE uid = \'' + user_id + '\' RETURNING location;', {location: location});
    })
    .then((data) => {
        return res.json(data.location);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })

})

app.post('/updateBio', (req, res) => {
    const {user_id, bio} = req.headers;
    //console.log("Server recieved user_id:", user_id);
    //console.log("Server recieved bio:", bio);
    console.log("Bio Data Type:", typeof(bio))

    db.tx(async t => {
        // return t.one('UPDATE profile SET bio = \'' + bio + '\' WHERE uid = \'' + user_id + '\' RETURNING bio;');
        return t.one('UPDATE profile SET bio = ${bio} WHERE uid = \'' + user_id + '\' RETURNING bio;', {bio: bio});
    })
    .then((data) => {
        return res.json(data.bio);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/updateHobby', (req, res) => {
    const {hobby_id, hobby, user_id, position} = req.headers;
    //console.log("Server recieved user_id:", user_id);
    //console.log("Server recieved hobby:", hobby)
    console.log("Server recieved position:", position);

    db.tx(async t => {
        return t.one('UPDATE hobbies SET hobby = ${hobby}, position=${position} WHERE uid = ${user_id} AND hobby_id = ${hobby_id} RETURNING hobby_id, hobby, uid, position;', 
        {
            hobby_id,
            hobby,
            user_id, 
            position
        });
    })
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/updateSkill', (req, res) => {
    const {skill_id, skill, user_id, position} = req.headers;
    //console.log("Server recieved user_id:", user_id);
    //console.log("Server recieved skill:", skill)
    console.log("Server recieved position:", position);

    db.tx(async t => {
        return t.one('UPDATE skills SET skill=${skill}, position=${position} WHERE uid = ${user_id} AND skill_id = ${skill_id} RETURNING skill_id, skill, uid, position;', 
        {
            skill_id,
            skill,
            user_id, 
            position
        });
    })
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})


app.post('/deleteHobby', (req, res) => {
    const {hobby_id} = req.headers;

    db.tx(async t => {
        return t.none('DELETE FROM hobbies WHERE hobby_id = \'' + hobby_id + '\';');
    })
    .then((data) => {
        return res.json({errors: false});
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/deleteSkill', (req, res) => {
    const {skill_id} = req.headers;

    db.tx(async t => {
        return t.none('DELETE FROM skills WHERE skill_id = \'' + skill_id + '\';');
    })
    .then((data) => {
        return res.json({errors: false});
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})


// ----------- [END] Edit About Tab -----------

//------------ [BEGIN] Edit Contact Tab ----------

app.post('/updatePublicEmail', (req, res) => {
    const {user_id, public_email} = req.headers;

    db.tx(async t => {
        return t.one('UPDATE profile SET public_email = ${public_email} WHERE uid = \'' + user_id + '\' RETURNING public_email;', {public_email});
    })
    .then((data) => {
        return res.json(data.public_email);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/updatePhone', (req, res) => {
    const {user_id, phone} = req.headers;

    db.tx(async t => {
        return t.one('UPDATE profile SET phone = ${phone} WHERE uid = \'' + user_id + '\' RETURNING phone;', {phone});
    })
    .then((data) => {
        return res.json(data.phone);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/createLink', (req, res) => {
    const {user_id, title, link, description, position} = req.headers;

    db.tx(async t => {
        const max_id = await t.one('SELECT MAX(link_id) FROM links;');
        let newId = max_id.max;
        newId++;

        return t.one('INSERT INTO links (link_id, uid, link, title, description, position) VALUES(${newId}, ${user_id}, ${link}, ${title}, ${description}, ${position}) RETURNING link_id, uid, link, title, description, position;', 
        {
            newId,
            user_id,
            link, 
            title,
            description,
            position
        });
    })
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/updateLink', (req, res) => {
    const {link_id, link, title, description, user_id, position} = req.headers;
    console.log("Server recieved position: ", position);

    db.tx(async t => {
        return t.one('UPDATE links SET link = ${link}, title = ${title}, description = ${description}, position=${position} WHERE uid = ${user_id} AND link_id = ${link_id} RETURNING link_id, uid, link, title, description, position;', 
        {
            link, 
            title,
            description,
            user_id,
            link_id,
            position
        });
    })
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/deleteLink', (req, res) => {
    const {link_id} = req.headers;

    db.tx(async t => {
        return t.none('DELETE FROM links WHERE link_id = ${link_id};',
        {
            link_id
        });
    })
    .then((data) => {
        return res.json({errors: false});
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})
// ----------- [END] Edit Contact Tab -----------

//------------ [BEGIN] Edit Portfolio Tab ----------

app.post('/createProject', (req, res) => {
    const {
        user_id, 
        title, 
        description,
        organization,
        from_when,
        to_when,
        link,
        position
    } = req.headers;

    db.tx(async t => {
        const max_id = await t.one('SELECT MAX(project_id) FROM projects;');
        let newId = max_id.max;
        newId++;

        return t.one('INSERT INTO projects (project_id, uid, title, description, organization, from_when, to_when, link, position) VALUES(${newId}, ${user_id}, ${title}, ${description}, ${organization}, ${from_when}, ${to_when}, ${link}, ${position}) RETURNING project_id, uid, title, description, organization, from_when::varchar, to_when::varchar, link, position', 
        {
            newId,
            user_id,
            title, 
            description,
            organization,
            from_when, 
            to_when,
            link,
            position
        });
    })
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/updateProject', (req, res) => {
    let {
        project_id, 
        user_id, 
        title, 
        description, 
        organization, 
        from_when, 
        to_when, 
        link,
        position
    } = req.headers;

    console.log("From When:", from_when);
    console.log("To When:", to_when);
    if(to_when == "null" || to_when == "undefined") to_when = "infinity";
    if(from_when == "null" || from_when == "undefined") from_when = "infinity";

    db.tx(async t => {
        return t.one('UPDATE projects SET title = ${title}, description = ${description}, organization = ${organization}, from_when = ${from_when}, to_when = ${to_when}, link = ${link}, position=${position} WHERE uid = ${user_id} AND project_id = ${project_id} RETURNING project_id, uid, title, description, organization, from_when::varchar, to_when::varchar, link, position;',
        {
            project_id, 
            user_id, 
            title, 
            description, 
            organization, 
            from_when, 
            to_when, 
            link,
            position
        });
    })
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/deleteProject', (req, res) => {
    const {project_id} = req.headers;

    db.tx(async t => {
        return t.none('DELETE FROM projects WHERE project_id = ${project_id};',
        {project_id});
    })
    .then((data) => {
        return res.json({errors: false});
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/createWorkExperience', (req, res) => {
    const {
        user_id, 
        occupation, 
        organization,
        from_when,
        to_when,
        description,
        position
    } = req.headers;

    db.tx(async t => {
        const max_id = await t.one('SELECT MAX(portfolio_id) FROM portfolio;');
        let newId = max_id.max;
        newId++;

        return t.one('INSERT INTO portfolio (portfolio_id, uid, occupation, organization, from_when, to_when, description, position) VALUES(${newId}, ${user_id}, ${occupation}, ${organization}, ${from_when}, ${to_when}, ${description}, ${position}) RETURNING portfolio_id, uid, occupation, organization, from_when::varchar, to_when::varchar, description, position', 
        {
            newId,
            user_id,
            occupation, 
            organization,
            from_when, 
            to_when,
            description,
            position
        });
    })
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/updateWorkExperience', (req, res) => {
    let {
        portfolio_id, 
        user_id, 
        occupation, 
        organization, 
        from_when, 
        to_when, 
        description,
        position
    } = req.headers;

    //console.log(description, organization, from_when, to_when, link)
    if(to_when == "null" || to_when == "undefined") to_when = "infinity";
    if(from_when == "null" || from_when == "undefined") from_when = "infinity";

    db.tx(async t => {
        return t.one('UPDATE portfolio SET occupation = ${occupation}, organization = ${organization}, from_when = ${from_when}, to_when = ${to_when}, description = ${description}, position=${position} WHERE uid = ${user_id} AND portfolio_id = ${portfolio_id} RETURNING portfolio_id, uid, occupation, description, organization, from_when::varchar, to_when::varchar, description, position;',
        {
            occupation, 
            organization, 
            from_when, 
            to_when, 
            description, 
            user_id, 
            portfolio_id,
            position
        });
    })
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/deleteWorkExperience', (req, res) => {
    const {portfolio_id} = req.headers;

    db.tx(async t => {
        return t.none('DELETE FROM portfolio WHERE portfolio_id = \'' + portfolio_id + '\';');
    })
    .then((data) => {
        return res.json({errors: false});
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})


app.post('/createEducation', (req, res) => {
    const {
        user_id, 
        organization, 
        education,
        from_when,
        to_when,
        description,
        position
    } = req.headers;

    db.tx(async t => {
        const max_id = await t.one('SELECT MAX(education_id) FROM education;');
        let newId = max_id.max;
        newId++;

        return t.one('INSERT INTO education (education_id, uid, organization, education, from_when, to_when, description, position) VALUES(${newId}, ${user_id}, ${organization}, ${education}, ${from_when}, ${to_when}, ${description}, ${position}) RETURNING education_id, uid, organization, education, from_when::varchar, to_when::varchar, description, position', 
        {
            newId,
            user_id,
            organization,
            education,
            from_when, 
            to_when,
            description,
            position
        });
    })
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/updateEducation', (req,res) => {
    let {
        education_id, 
        user_id, 
        organization, 
        education, 
        from_when, 
        to_when, 
        description,
        position
    } = req.headers;

    //console.log(description, organization, from_when, to_when, link)
    if(to_when == "null" || to_when == "undefined") to_when = "infinity";
    if(from_when == "null" || from_when == "undefined") from_when = "infinity";

    db.tx(async t => {
        return t.one('UPDATE education SET organization = ${organization}, education = ${education}, from_when = ${from_when}, to_when = ${to_when}, description = ${description}, position=${position} WHERE uid = ${user_id} AND education_id = ${education_id} RETURNING education_id, uid, organization, education, from_when::varchar, to_when::varchar, description, position;',
        {
            education_id, 
            user_id, 
            organization, 
            education, 
            from_when, 
            to_when, 
            description,
            position
        });
    })
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/deleteEducation', (req, res) => {
    const {education_id} = req.headers;

    db.tx(async t => {
        return t.none('DELETE FROM education WHERE education_id = ${education_id};', {education_id});
    })
    .then((data) => {
        return res.json({errors: false});
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port ' + PORT));