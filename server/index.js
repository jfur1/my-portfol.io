const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser');
var db = require("./db");

// Express
const app = express();

app.use(cors());
app.use(express.json()); //req.body

// Body-parser
//app.use(bodyParser.urlencoded({ extended: false }));

// Routes

app.get('/getData', function(req, res){
    db.tx(t => {
        return t.any('SELECT * FROM testTable;');
    })
    .then((d) => {
        console.log("Successfully returned data!");
        console.log(d);
        res.json(d.rows);
    })
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port ' + PORT));