const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser');
var db = require("./config/db");
const path = require('path');

// Express
const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client')));

app.use(cors());
app.use(express.json()); //req.body

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

app.post('/insert', (req, res) => {
    const { data } = req.body;
    console.log(data);


    db.tx(data => {
        return data.none('INSERT INTO testTable(data) VALUES($1)',[data])
    })
    .then(() => {
        console.log("Inserted data into DB successfully!");
        res.json();
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/newUser', function(req, res){
    console.log('Request Body Recieved by the Server: \n' , req.body);
    const {
        firstname,
        lastname,
        email,
        password
    } = req.body;
    
    // Check if user exists in database
    db.tx(t => {
        return t.oneOrNone('SELECT * FROM users WHERE \'' + email + '\' = email;');
    })
    .then((row) => {
        console.log(row);
        if(row === null){
            console.log("Email is already taken!");
            // Only get to this point if email not already in the DB
            console.log('Storing User!');

            // Use db.task when we want to chain queries 
            db.task(t => {
                return t.one('SELECT MAX(user_id) FROM users;')
                    .then((data) => {
                        //console.log("Data: ", data);
                        let newUserId = data.max;
                        newUserId++;
                        //console.log("New User ID: ", newUserId);
                        return t.none('INSERT INTO users (user_id, first_name, last_name, email, password) VALUES($1, $2, $3, $4, $5)', 
                        [
                            newUserId,
                            firstname,
                            lastname,
                            email,
                            password
                        ]);
                    })
            })
            .then(user => {
                console.log('[Server] Success! New user stored in database.');
                res.send("Stored User!");
            })
            .catch((err) => {
                console.log(err);
            });
        }
        else{
            console.log("Email already exists!");
        }
    })
    .catch((err) => {
        console.log(err);
    })
    
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port ' + PORT));