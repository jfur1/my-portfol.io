const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs');
var db = require("./config/db");
const path = require('path');

// Express
const app = express();

app.use(cors());
app.use(express.json()); //req.body
app.use(express.urlencoded({extended: true}));

// Routes

app.get('/getData', function(req, res){
    db.tx(t => {
        return t.any('SELECT * FROM users;');
    })
    .then((d) => {
        console.log("Successfully returned users table!");
        console.log(d, '\n');
        return res.json(d);
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port ' + PORT));