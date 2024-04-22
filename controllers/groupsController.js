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

// Heataan nomen perusteella
router.get('/name/:name', function (request, response) {
    Group.getByName(request.params.name, function (err, dbResult) {
        if (err) {
            response.json(err);
        } else {
            console.log(dbResult.rows);
            console.log("getByName");
            response.json(dbResult.rows);
        }
    });
});

//Lisää uusi ryhmä
router.post('/', function (request, response) {
    Group.add(request.body, function (err, dbResult) {
        if (err) {
            if(err.error == 'Group name not available'){
                response.status(404).json({error: 'Tämä nimi on jo käytössä'});
            } else {
                response.status(404).json({error: 'Jokin meni pieleen'});  
                console.log(err.error);
            }
        } else {
            //console.log(dbResult);
            //console.log("add");
            if(dbResult.rowCount > 0){
                response.status(200).json({message: 'Ryhmän lisäys onnistui!'});
            }
            
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