const dotenv = require('dotenv').config();
var express = require('express');
const https = require('https');
const pgPool = require('./database/pg_connection');
const App=express();
const cors = require('cors');
//App.use(express.json);

App.use(express.static('public'));
App.use(cors());

App.get('/', () => {
    let data = '';
    const request = https.get('https://api.themoviedb.org/3/movie/11?api_key=' + process.env.API_KEY, (response) => {
        console.log('https://api.themoviedb.org/3/movie/11?api_key=' + process.env.API_KEY);
        response.on('data', (chunk) => {
            data += chunk;
            console.log(response.data);
        });
        response.on('end', () => {
            console.log("error");
            console.log(data);
        });
        request.end();
    });
});

App.listen(process.env.PORT, function(){
    console.log("listening port " + process.env.PORT);
});

module.exports=App;