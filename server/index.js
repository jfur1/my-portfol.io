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
        return t.any('SELECT * FROM testTable;');
    })
    .then((d) => {
        console.log("Successfully returned data!");
        console.log(d, '\n');
        return res.json(d);
    })
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port ' + PORT));