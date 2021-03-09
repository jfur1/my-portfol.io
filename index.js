const express = require("express");
var cors = require('cors');
const bcrypt = require('bcryptjs');
var db = require("./config/db");
const session = require('express-session');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const path = require("path");

// Express
const app = express();

if(process.env.NODE_ENV == 'production'){
    app.use(express.static(path.join(__dirname, "client/build")));
}

// Middleware
app.use(express.json({ limit: '20mb' })); //req.body
app.use(express.urlencoded({extended: false}));


// --------------------------- BEGIN Passport.js Middleware ---------------------

// Passport Config
passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        console.log('Made it to auth!');

        // Match User
        db.tx(t => {
            if(email.includes('@'))
                return t.oneOrNone('SELECT * FROM users WHERE ${email} = email;', {email});
            else
                return t.oneOrNone('SELECT * FROM users WHERE ${email} = username;', {email});
        })
        .then((rows) => {
            const user = rows;
            if (!user) {
                console.log('Wrong email or username!');
                return done(null, false, { message: 'That email/username is not registered' });
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

// Configure Mail Server Responsible for Sending/Recieving Mail
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "myportfolio.help@gmail.com",
        pass: "mppassword"
    }
});

// ------------------------ END Passport.js Middleware ------------------------------

// Routes

app.post('/newUser', async(req, res) => {
    console.log('Request Body Recieved by the Server: \n' , req.body);
    const {
        fullname,
        username,
        email,
        password
    } = req.body;

    db.task(async t => {
        const email_check = await t.oneOrNone('SELECT * FROM users WHERE email=${email};', {email});
        const username_check = await t.oneOrNone('SELECT * FROM users WHERE username=${username};', {username});
        
        if(email_check !== null && username_check !== null){
            return 3;
        } else if(email_check !== null){
            return 2;
        } else if(username_check !== null){
            return 1;
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

            return t.none('INSERT INTO users (user_id, fullname, username, email, password) VALUES(${newUserId}, ${fullname}, ${username}, ${email}, ${hashedPassword})', 
            {
                newUserId,
                fullname,
                username,
                email,
                hashedPassword
            })
        }
    })
    .then(data => {
        if(data === 3){
            return res.json({failedAttempt: true, usernameTaken: true, emailTaken: true});
        } else if(data === 2){
            return res.json({failedAttempt: true, usernameTaken: false, emailTaken: true});
        } else if(data === 1){
            return res.json({failedAttempt: true, usernameTaken: true, emailTaken: false});
        }

        console.log("Made it to register user callback.");
        return res.json({isRegistered: true, failedAttempt: false, emailTaken: false, usernameTaken: false});
    })
    .catch((err) => {
        console.log(err);
        res.json({isRegistered: false, newUser: false, failedAttempt: true, emailTaken: false, usernameTaken: false});
    })
})


app.post('/login', (req, res, next) => {
    const { email } = req.body;
    
    let errors = [];
    db.tx(t => {
        if(email.includes('@')){
            console.log("Checking for email:", email);
            return t.oneOrNone('SELECT * FROM users WHERE ${email} = email;', {email});
        }
        else{
            console.log("Checking for username:", email);
            return t.oneOrNone('SELECT * FROM users WHERE ${email}=username;', {email});
        }
    })
    .then((data) => {
         if (data == null) {
            console.log('No users registered with that email or username!');
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

app.post('/forgotPassword', (req, res) => {
    const {email} = req.body;
    
    db.tx(t => {
        if(email.includes('@')){
            return t.oneOrNone('SELECT * FROM users WHERE ${email} = email;', {email});
        }else{
            return t.oneOrNone('SELECT * FROM users WHERE ${email}=username;', {email});
        }
    })
    .then((data) => {

        if(data == null){
            console.log('No users registered with that email or username!');
            return -1;
        } else{
            const token = crypto.randomBytes(20).toString('hex');
            data.resetPasswordToken = token;
            data.resetTokenExpires = Date.now() + 3600000;  // 1 hour

            const mailOptions = {
                from: 'myportfolio.help@gmail.com',
                to: `${data.email}`,
                subject: 'Link to Reset Password',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` + 
                `Please click on the following link, or paste this into your browser to complete the process within an hour of receiving it:\n\n` + 
                `www.my-portfol.io/reset/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };

            smtpTransport.sendMail(mailOptions, function(err){
                if(err) console.log(err);
            });

            db.tx(token => {
                return token.none('UPDATE users SET reset_token=$1, token_expires=$2 WHERE email=$3', [data.resetPasswordToken, data.resetTokenExpires, data.email]);
            })
        }
    })
    .then((response) => {
        if(response === -1){
            return res.json({data: 'No users registered with that email/username.'});
        }
        else{
            return res.status(200).json({data: 'Recovery email sent.'});
        }
    })
    .catch((err) => console.log(err));
})

app.get('/reset/:token', (req, res) => {
    console.log(req.params.token)
    db.tx(check => {
        return check.oneOrNone('SELECT * FROM users WHERE reset_token=${token} AND CAST(token_expires AS BIGINT) > ${currentTime};', 
            {
                token: req.params.token, 
                currentTime: Date.now()
            });
    })
    .then((data) => {
        console.log(data)
        if(!data){
            return res.json({authenticated: false});
        }
        else{
            console.log("Authenticated Token!")
            return res.json({authenticated: true, email: data.email});
        }
    })
    .catch(err => console.log(err));
})

app.post('/reset/:token', (req, res) => {
    const {email, password} = req.body;

    db.tx(async reset => {
        const data = await reset.oneOrNone('SELECT * FROM users WHERE email=${email}', {email});
        return data;
    })
    .then(async data => {
        console.log(data)
        if(!data){
            return res.json({error: true});
        }
        else if(data.token_expires < Date.now() || data.reset_token === 0){
            return res.json({error: true, invalidToken: true});
        }
        else{
            // Hash Password
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            db.tx(reset => {
                return reset.none('UPDATE users SET password=$1, reset_token=$2, token_expires=$3 WHERE email=$4', 
                [
                    hashedPassword, 
                    0,
                    0, 
                    email
                ]);
            })
            .then(d => {
                var confirmChange = {
                    to: `${email}`,
                    from: 'myportfolio.help@gmail.com',
                    subject: 'Your password has been changed',
                    text: 'Hello ' + data.fullname + ',\n\n'+
                        'This email is a confirmation that the password for your account ' + data.username + ' has just been changed.\n'
                };
                smtpTransport.sendMail(confirmChange, function(err){
                    if(err) console.log(err);
                })
                return res.json({error: false, updated: true});
            })
            .catch(error =>{
                console.log('ERROR', error);
            })
        }
    })
    .catch(error =>{
        console.log('ERROR', error);
    })
})

// Logout
app.post('/logout', (req, res) => {
    req.logout();
    console.log("You logged out");
    res.json({authenticated: false});
    return;
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

    db.tx(async t => {
        const data = await t.oneOrNone('SELECT * FROM users WHERE username = ${username};', {username});
        return data
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
                    fullname: user.fullname,
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

app.get('/about', (req, res) => {
    const username = req.headers.username;
    
    db.task(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE username = ${username};', {username});

        if(!user){
            return res.json({error: true});
        }

        const data = await t.oneOrNone('SELECT * FROM profile WHERE uid = ${user_id};', {user_id: user.user_id});
        return data;
    })
    .then((about) => {
        return res.json(about);
    })
    .catch((err) => console.log(err));

})

app.get('/profile', (req, res) => {
    const username = req.headers.username;
    
    db.tx(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE username = ${username};', {username});
        
        if(!user){
            return res.json({error: true});
        }

        const data = await t.any('SELECT * FROM profile WHERE uid = ${user_id};', 
        {user_id: user.user_id});
        return data;
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
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE username = ${username};', {username});
        
        if(!user){
            return res.json({error: true});
        }

        const data = await t.any('SELECT portfolio_id, uid, occupation, organization, from_when::varchar, to_when::varchar, description FROM portfolio WHERE uid = $1 ORDER BY position', user.user_id);
        return data;
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
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE username = ${username};', {username});

        if(!user){
            return res.json({error: true});
        }

        return t.any('SELECT * FROM links WHERE uid=${user_id} ORDER BY position;', {user_id: user.user_id});
    })
    .then((links) => {
        return res.json(links);
    })
    .catch((err) => console.log(err));

})

app.get('/education', (req, res) => {
    const username = req.headers.username;

    db.tx(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE username = ${username};', {username});

        if(!user){
            return res.json({error: true});
        }

        const data = await t.any('SELECT education_id, uid, organization, education, from_when::varchar, to_when::varchar, description FROM education WHERE uid=${user_id} ORDER BY position;', {user_id: user.user_id});
        return data;
    })
    .then((eduaction) => {
        return res.json(eduaction);
    })
    .catch((err) => console.log(err));
})

app.get('/hobbies', (req, res) => {
    const username = req.headers.username;

    db.tx(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE username = ${username};', {username});

        if(!user){
            return res.json({error: true});
        }

        const data = await t.any('SELECT * FROM hobbies WHERE uid=${user_id} ORDER BY position;', {user_id: user.user_id});
        return data;
    })
    .then((hobbies) => {
        return res.json(hobbies);
    })
    .catch((err) => console.log(err));
})

app.get('/skills', (req, res) => {
    const username = req.headers.username;

    db.tx(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE username = ${username};', {username});

        if(!user){
            return res.json({error: true});
        }

        const data = await t.any('SELECT * FROM skills WHERE uid=${user_id} ORDER BY position;', {user_id: user.user_id});
        return data;
    })
    .then((skills) => {
        return res.json(skills);
    })
    .catch((err) => console.log(err));
})

app.get('/projects', (req, res) => {
    const username = req.headers.username;

    db.tx(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE username = ${username};', {username});

        if(!user){
            return res.json({error: true});
        }

        const data = await t.any('SELECT project_id, uid, title, description, organization, from_when::varchar, to_when::varchar, link, position FROM projects WHERE uid=${user_id} ORDER BY position;', {user_id: user.user_id});
        return data;
    })
    .then((skills) => {
        return res.json(skills);
    })
    .catch((err) => console.log(err));
})

app.get('/images', (req, res) => {
    const username = req.headers.username;

    db.tx(async t => {
        const user = await t.oneOrNone('SELECT user_id FROM users WHERE username = ${username};', {username});

        if(!user){
            return res.json({error: true});
        }

        const data = await t.any('SELECT uid, base64image, base64preview, prefix, x, y, radius FROM images WHERE uid = ${user_id};', {user_id: user.user_id});
        return data;
    })
    .then((images) => {

        return res.json(images);
    })
    .catch((err) => console.log(err));
})

// ----------- [BEGIN] Edit Home Tab -----------

app.post('/updateFullname', (req, res) => {
    const {user_id, fullname} = req.headers;
    db.tx(async t => {
        const user = await t.none('UPDATE users SET fullname = ${fullname} WHERE user_id = ${user_id}',
        {
            user_id, 
            fullname
        });
    })
    .then(data => {
        return res.json({success: true});
    })
    .catch((err) => console.log(err));
})

app.post('/createCurrentOccupation', (req, res) => {
    const {user_id, occupation} = req.headers;
    db.task(async t => {
        const user = await t.oneOrNone('SELECT * FROM profile WHERE ${user_id} = uid;', {user_id});
        if(user == null){
            const max_id = await t.one('SELECT MAX(profile_id) FROM profile;');
            let newId = max_id.max;
            newId++;
    
            return t.none('INSERT INTO profile (profile_id, uid, current_occupation) VALUES(${newId}, ${user_id}, ${occupation});', 
            {
                newId,
                user_id,
                occupation
            })
        }
        // User may already have profile entry via createBio etc. But no occupation
        else{
            return t.none('UPDATE profile SET current_occupation=${occupation} WHERE uid = ${user_id};', 
            {
                user_id,
                occupation
            });
        }
    })
    .then(data => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/updateCurrentOccupation', (req, res) => {
    const {user_id, occupation} = req.headers;
    db.tx(async t => {
        return t.none('UPDATE profile SET current_occupation=${occupation} WHERE uid=${user_id};', {user_id, occupation});
    })
    .then(data => {
        return res.json(data);
    })
    .catch(err => console.log(err));
})

app.post('/createCurrentOrganization', (req, res) => {
    const {user_id, organization} = req.headers;
    db.task(async t => {
        const user = await t.oneOrNone('SELECT * FROM profile WHERE ${user_id} = uid;', {user_id});
        if(user == null){
            const max_id = await t.one('SELECT MAX(profile_id) FROM profile;');
            let newId = max_id.max;
            newId++;

            return t.none('INSERT INTO profile (profile_id, uid, current_organization) VALUES(${newId}, ${user_id}, ${organization});', 
            {
                newId,
                user_id,
                organization
            });
        }
        // User may already have profile entry via createBio etc. But no organization
        else{
            return t.none('UPDATE profile SET current_organization=${organization} WHERE uid = ${user_id};', 
            {
                user_id,
                organization
            });
        }
    })
    .then(data => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/updateCurrentOrganization', (req, res) => {
    const {user_id, organization} = req.headers;
    db.tx(async t => {
        return t.none('UPDATE profile SET current_organization=${organization} WHERE uid=${user_id};', {user_id, organization});
    })
    .then(data => {
        return res.json(data);
    })
    .catch(err => console.log(err));
})

app.post('/createProfileImages', (req, res) => {
    const {user_id, base64image, base64preview, prefix} = req.body;
    //console.log("Req.body:", req.body)
    
    db.tx(async t => {

        const data = await t.none('INSERT INTO images (uid, base64image, base64preview, prefix) VALUES(${user_id}, decode(${base64image}, \'base64\') , decode(${base64preview}, \'base64\'), ${prefix});', 
        {
            user_id,
            base64image,
            base64preview,
            prefix
        });
        return data;
    })
    .then(data => {
        return res.json({errors: false});
    })
    .catch(err => console.log(err));
})

app.post('/updateProfileImages', (req, res) => {
    const {user_id, base64image, base64preview, prefix} = req.body;

    db.tx(async t => {
        const data = await t.none('UPDATE images SET base64image=decode(${base64image}, \'base64\'), base64preview=decode(${base64preview}, \'base64\'), prefix=${prefix} WHERE uid=${user_id};', 
        {
            user_id,
            base64image,
            base64preview,
            prefix
        });
        return data;
    })
    .then(data => {
        return res.json({errors: false});
    })
    .catch(err => console.log(err));
})

app.post('/updateFont', (req, res) => {
    const {user_id, font} = req.body;
    console.log("Server recieved font:", font)
    db.tx(async t => {
        return t.none('UPDATE profile SET font=${font} WHERE uid=${user_id};', 
        {
            user_id, 
            font
        });
    })
    .then(data => {
        return res.json({errors: false});
    })
    .catch(err => console.log(err));
})

app.post('/updateFontSize', (req, res) => {
    const {user_id, size} = req.body;

    db.tx(async t => {
        return t.none('UPDATE profile SET font_size=${size} WHERE uid=${user_id};', 
        {
            user_id, 
            size
        });
    })
    .then(data => {
        return res.json({errors: false});
    })
    .catch(err => console.log(err));
})

app.post('/updatePreviewCoords', (req, res) => {
    const {user_id, x, y, radius} = req.body;

    db.tx(async t => {
        const data = await t.none('UPDATE images SET x=${x}, y=${y}, radius=${radius} WHERE uid=${user_id};', 
        {
            user_id, 
            x,
            y,
            radius
        });
        return data;
    })
    .then(data => {
        return res.json({errors: false});
    })
    .catch(err => console.log(err));
})


// ----------- [BEGIN] Edit About Tab -----------

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
    const {user_id, location} = req.body;

    db.tx(async t => {
        const user = await t.oneOrNone('SELECT * FROM profile WHERE uid = ${user_id};', {user_id});
        if(!user){
            const max_id = await t.one('SELECT MAX(profile_id) FROM profile;');
            let newId = max_id.max;
            newId++;
            return t.one('INSERT INTO profile (profile_id, uid, location) VALUES(${newId}, ${user_id}, ${location}) RETURNING profile_id, uid, location', 
            {
                newId,
                user_id,
                location
            })
        }
        else{
            return t.one('UPDATE profile SET location = ${location} WHERE uid = ${user_id} RETURNING location;', {user_id: user_id, location: location});
        }
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
    const {user_id, bio} = req.body;
    console.log("Bio Data Type:", typeof(bio))

    db.tx(async t => {
        const user = await t.oneOrNone('SELECT * FROM profile WHERE uid = ${user_id};', {user_id});
        if(!user){
            const max_id = await t.one('SELECT MAX(profile_id) FROM profile;');
            let newId = max_id.max;
            newId++;

            return t.one('INSERT INTO profile (profile_id, uid, bio) VALUES(${newId}, ${user_id}, ${bio}) RETURNING profile_id, uid, bio', 
            {
                newId,
                user_id,
                bio
            })
        }
        else{
            return t.one('UPDATE profile SET bio = ${bio} WHERE uid = ${user_id} RETURNING bio;', {user_id: user_id, bio: bio});
        }
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
        return t.none('DELETE FROM hobbies WHERE hobby_id = ${hobby_id};', {hobby_id});
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
        return t.none('DELETE FROM skills WHERE skill_id = ${skill_id};', {skill_id});
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
        const user = await t.oneOrNone('SELECT * FROM profile WHERE uid=${user_id};', {user_id});

        if(!user){
            const max_id = await t.one('SELECT MAX(profile_id) FROM profile;');
            let newProfileId = max_id.max;
            newProfileId++;
            return t.none('INSERT INTO profile (profile_id, uid, public_email) VALUES (${newProfileId}, ${user_id}, ${public_email});', {newProfileId, user_id, public_email})
        }
        else{
            return t.none('UPDATE profile SET public_email = ${public_email} WHERE uid = \'' + user_id + '\';', {public_email});
        }
    })
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/updatePhone', (req, res) => {
    const {user_id, phone} = req.headers;

    db.tx(async t => {
        const user = await t.oneOrNone('SELECT * FROM profile WHERE uid=${user_id};', {user_id});

        if(!user){
            const max_id = await t.one('SELECT MAX(profile_id) FROM profile;');
            let newProfileId = max_id.max;
            newProfileId++;
            return t.none('INSERT INTO profile (profile_id, uid, phone) VALUES (${newProfileId}, ${user_id}, ${phone});', {newProfileId, user_id, phone})
        }
        else{
            return t.none('UPDATE profile SET phone = ${phone} WHERE uid = \'' + user_id + '\';', {phone});
        }
    })
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json({error: true})
    })
})

app.post('/createLink', (req, res) => {
    console.log(req.body)
    const {user_id, linkObj, position} = req.body;
    const link = linkObj.link;
    const title = linkObj.title;
    const description = linkObj.description;


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
    const {linkObj, user_id, position} = req.body;
    const link = linkObj.link;
    const title = linkObj.title;
    const description = linkObj.description;
    const link_id = linkObj.link_id;

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
    } = req.body;

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
    } = req.body;

    // console.log("From When:", from_when);
    // console.log("To When:", to_when);
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
    } = req.body;

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
    } = req.body;

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
    } = req.body;

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
    } = req.body;

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

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("/*", function(req, res) {
      res.sendFile(path.join(__dirname, "./client/build/index.html"));
    });
  }
  
  else {
    app.use(express.static(path.join(__dirname, '/client/public')));
    app.get("/*", function(req, res) {
      res.sendFile(path.join(__dirname, "./client/public/index.html"));
    });
  }

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port ' + PORT));