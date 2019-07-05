// server.js
// load the things we need
const express = require('express');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

//to use the files inside the directory
app.use("/styles",express.static(__dirname + "/styles"));
app.use("/js",express.static(__dirname + "/js"));
app.use("/fonts",express.static(__dirname + "/fonts"));

// use res.render to load up an ejs view file
// index page 
app.get('/login', function(req, res) {
    res.render('pages/login');
});

// student page 
app.get('/student', function(req, res) {
    res.render('pages/student');
});

// batch page
app.get('/batch', function(req, res) {
    res.render('pages/batch');
});

// fee page
app.get('/fee', function(req, res) {
    res.render('pages/fee');
});

//login page
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.listen(8080);
console.log('8080 is the magic port');