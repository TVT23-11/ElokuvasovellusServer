const dotenv = require('dotenv').config();
var express = require('express');

const TMDB_router = require('./controllers/TMDBController');
const User_router = require('./controllers/userController');

const App=express();
const cors = require('cors');
App.use(cors());

App.use('/TMDB', TMDB_router);
App.use('/user', User_router);

App.listen(process.env.PORT, function(err){
    if (err) console.log(err);
    console.log("listening port " + process.env.PORT);
});

module.exports=App;