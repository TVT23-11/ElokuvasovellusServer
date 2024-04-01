const dotenv = require('dotenv').config();
var express = require('express');

const TMDB_router = require('./controllers/TMDBController');

const App=express();
//App.use(express.json);

App.use('/TMDB', TMDB_router);

App.listen(process.env.PORT, function(){
    console.log("listening port " + process.env.PORT);
});

module.exports=App;