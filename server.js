// server.js
// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

//to use the files inside the directory
app.use("/styles",express.static(__dirname + "/styles"));
app.use("/js",express.static(__dirname + "/js"));
app.use("/fonts",express.static(__dirname + "/fonts"));

// use res.render to load up an ejs view file
// index page 
app.get('/', function(req, res) {
    // res.render('pages/index');

    res.render('pages/login');
    
});

// about page 
app.get('/student', function(req, res) {
    res.render('pages/student');
});

//add student page
app.get('/form', function(req, res) {
    res.render('pages/form');
});

//login page
app.get('/index', function(req, res) {
    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

    res.render('pages/index', {
        drinks: drinks,
        tagline: tagline
    });
});

app.listen(8080);
console.log('8080 is the magic port');