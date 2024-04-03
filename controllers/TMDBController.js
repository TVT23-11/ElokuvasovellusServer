const dotenv = require('dotenv').config();
const express = require('express');
const Router = express.Router();
const https = require('https');

Router.get('/', (req, res) => {
    let data = '';
    const request = https.get('https://api.themoviedb.org/3/movie/11?api_key=' + process.env.API_KEY, (response) => {
        response.on('data', (chunk) => {
            // Otetaan TMDB:stä saatu data talteen
            data += chunk; 
        });
        response.on('end', () => {
            // Lähetetään saatu data front-endille
            res.json(data);
        });
        request.end();
    });
});

module.exports = Router;