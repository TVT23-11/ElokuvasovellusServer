const express = require('express');
const dotenv = require('dotenv').config();
const router = express.Router();
const Group = require('../models/groupsModel');
router.use(express.urlencoded());
router.use(express.json());


// Haetaan kaikki 
router.get('/', function (request, response) {
    Group.getAll(function (err, dbResult) {
        if (err) {
            response.json(err);
        } else {
            console.log(dbResult.rows);
            console.log("getAll");
            response.json(dbResult.rows);
        }
    });
});

// Heataan id perusteella
router.get('/:id', function (request, response) {
    Group.getById(request.params.id, function (err, dbResult) {
        if (err) {
            response.json(err);
        } else {
            console.log(dbResult.rows);
            console.log("getById");
            response.json(dbResult.rows);
        }
    });
});

//Lisää uusi ryhmä
router.post('/', function (request, response) {
    console.log(request.body);
    Group.add(request.body, function (err, dbResult) {
        if (err) {
            response.json(err);
        } else {
            console.log(dbResult);
            console.log("add");
            response.json(dbResult);
        }
    });
});

// Poista ryhmä id:n perusteella
router.delete('/:id', function (request, response) {
    Group.delete(request.params.id, function (err, dbResult) {
        if (err) {
            response.json(err);
        } else {
            console.log(dbResult.rows);
            console.log("delete");
            response.json(dbResult.rows);
        }
    });
});

module.exports = router;