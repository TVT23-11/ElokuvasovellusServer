const express = require('express');
const dotenv = require('dotenv').config();
const router = express.Router();
const Favorites = require('../models/favoritesModel');
router.use(express.urlencoded({extended:false}));
router.use(express.json());

// Haetaan kaikki suosikit
router.get('/:token', function (request, response) {
    Favorites.getAll(request.params.token, function (err, dbResult) {
        if (err) {
            response.json(err);
        } else {
            console.log(dbResult.rows);
            console.log("getAll");
            response.status(200).json(dbResult.rows);
        }
    });
});

// Lisätään uusi suosikki
router.post('/addFavorite/', function (request, response) {
    Favorites.addFavorite(request.body, function (err, dbResult) {
        if (err) {
            response.status(404).json({ error: 'Jokin meni pieleen' });
            console.log(err);
        } else {
            console.log(dbResult);
            if(dbResult.rowCount > 0){
                response.status(200).json({message: 'success'});
            } else {
                response.status(404).json({error: 'Jokin meni pieleen'});  
                console.log(dbResult);
            }
        }
    });
});

// Poista suosikki
router.delete('/deleteFavorite/:token/:movie', function (request, response) {
    console.log(request.query.token);
    Favorites.delete(request.params.token, request.params.movie, function (err, dbResult) {
        if (err) {
            response.status(404).json({error: 'Jokin meni pieleen'}); 
            console.log(err);
        } else {
            console.log(dbResult.rowCount);
            if(dbResult.rowCount > 0){
                response.status(200).json({message: "success"});
            }
            else{
                response.status(404).json({error: 'Jokin meni pieleen'});  
                console.log(dbResult);
            }
        }
    });
});

module.exports = router;