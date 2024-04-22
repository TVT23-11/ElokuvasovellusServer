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

Router.get('/genre', (req, res) => {
    let data = '';
    const request = https.get('https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=' + process.env.API_KEY, (response) => {
        response.on('data', (chunk) => {
            // Otetaan TMDB:stä saatu data talteen
            data += chunk; 
        });
        response.on('end', () => {
            // Lähetetään saatu data front-endille
            res.status(200).json(data);
        });
        request.end();
    });
});

Router.get('/elokuvahaku', (req, res) => {
    let data = '';
    let hakusana = req.query.hakusana;
    let vuosi = req.query.year;
    if(vuosi != ''){
        vuosi = '&primary_release_year=' + vuosi;
    }
    const request = https.get('https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&query='+hakusana+vuosi+'page=1&api_key=' + process.env.API_KEY, (response) => {
        response.on('data', (chunk) => {
            // Otetaan TMDB:stä saatu data talteen
            data += chunk; 
        });
        response.on('end', () => {
            // Lähetetään saatu data front-endille
            res.status(200).json(data);
        });
        request.end();
    });
});

module.exports = Router;