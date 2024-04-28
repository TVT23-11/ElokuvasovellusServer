const express = require('express');
const dotenv = require('dotenv').config();
const router = express.Router();
const Review = require('../models/reviewModel');
router.use(express.urlencoded({extended:false}));
router.use(express.json());


// Haetaan kaikki arvostelut
router.get('/', function (request, response) {
    Review.getAll(function (err, dbResult) {
        if (err) {
            response.json(err);
        } else {
            console.log(dbResult.rows);
            console.log("getAll");
            response.status(200).json(dbResult.rows);
        }
    });
});

// Lisätään uusi arvostelu
router.post('/addReview/', function (request, response) {
    Review.addReview(request.body, function (err, dbResult) {
        if (err) {
            response.status(404).json({ error: 'Jokin meni pieleen' });
            console.log(err.error);
        } else {
            if(dbResult.rowCount > 0){
                response.status(200).json({message: 'success'});
            } else {
                response.status(404).json({error: 'Jokin meni pieleen'});  
                console.log(dbResult);
            }
        }
    });
});

module.exports = router;