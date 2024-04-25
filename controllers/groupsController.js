const express = require('express');
const dotenv = require('dotenv').config();
const router = express.Router();
const Group = require('../models/groupsModel');
router.use(express.urlencoded({extended:false}));
router.use(express.json());


// Haetaan kaikki 
router.get('/All/', function (request, response) {
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

// Heataan kaikki ryhmät sekä tieto siitä, onko käyttäjä ryhmän jäsen
router.get('/All/:token', function (request, response) {
    Group.listGroups(request.params.token, function (err, dbResult) {
        if (err) {
            response.json(err);
        } else {
            console.log(dbResult.rows);
            console.log("getByToken");
            response.status(200).json(dbResult.rows);
        }
    });
});

// Pyydetään jäsenyyttä
router.post('/requestGroupMembership/', function (request, response) {
    Group.requestGroupMembership(request.body, function (err, dbResult) {
        if (err) {
            response.status(404).json({ error: 'Jokin meni pieleen' });
            console.log(err.error);
        } else {
            console.log(dbResult);
            if(dbResult.rowCount > 0){
                response.status(200).json({message: 'Ryhmään liittyminen onnistui'});
            } else {
                response.status(404).json({error: 'Jokin meni pieleen'});  
                console.log(dbResult);
            }
            
        }
    });
});

// Heataan käyttäjälle lähetetyt ryhmään pääsy pyynnöt
router.get('/joinRequests/:token', function (request, response) {
    Group.joinRequests(request.params.token, function (err, dbResult) {
        if (err) {
            response.json(err);
        } else {
            console.log(dbResult.rows);
            console.log("joinRequests");
            response.json(dbResult.rows);
        }
    });
});

// Heataan nimen perusteella
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
// Heataan tiedot Ryhmän omalle sivulle
router.get('/groupDetails/:id/:token', function (request, response) {
    Group.groupDetails(request.params.id, request.params.token, function (err, dbResult) {
        if (err) {
            response.status(404).json({ error: 'Jokin meni pieleen' });
            console.log(err.error);
        } else {
            console.log(dbResult);
            console.log("groupDetails");
            response.status(200).json(dbResult);
        }
    });
});
// Heataan ne ryhmät, joihin käyttäjä on ylläpitäjä
router.get('/isAdmin/:token', function (request, response) {
    Group.isAdminToGroups(request.params.token, function (err, dbResult) {
        if (err) {
            response.status(404).json({ error: 'Jokin meni pieleen' });
            console.log(err);
        } else {
            console.log(dbResult.rows);
            console.log("isAdminToGroups");
            response.status(200).json(dbResult.rows);
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
            if(dbResult.rowCount > 0){
                response.status(200).json({message: 'Ryhmän lisäys onnistui!'});
            } else {
                response.status(404).json({error: 'Jokin meni pieleen'});  
                console.log(dbResult);
            }
            
        }
    });
});

//Hyväksy ryhmään jäsen
router.put('/acceptToGroup/', function (request, response) {
    Group.acceptToGroup(request.body, function (err, dbResult) {
        if (err) {
            response.status(404).json({error: 'Jokin meni pieleen'});  
            console.log(err.error);
        } else {
            if(dbResult.rowCount > 0){
                response.status(200).json({message: 'success'});
            }
            else{
                response.status(404).json({error: 'Käyttäjää ei löytynyt'});
            }
        }
    });
});

// Poista ryhmä id:n perusteella
router.delete('/deleteGroup/:id', function (request, response) {
    Group.delete(request.params.id, function (err, dbResult) {
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

// Hylkää liittymispyyntö
router.delete('/denyRequestToJoin/:user/:group', function (request, response) {
    Group.denyFromGroup(request.params.user, request.params.group, function (err, dbResult) {
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