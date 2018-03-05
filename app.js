//Dependencies
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

//Configuration
var app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));


//Logging to file
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));

//MongoDB setup
mongoose.connect("mongodb://localhost/CC");


//ROUTE FILES
var mainRoute = require("./routes/main");
app.use(mainRoute);


//TODO: don't allow duplicates in DB and make sure we only check for a specific domain every 24 hour.


app.listen(3000, function() {
    console.log("Listening on port 3000");
});