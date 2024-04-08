const express = require('express');
const Router = express.Router();
const User = require('../models/user');
Router.use(express.urlencoded());
Router.use(express.json());

Router.post('/register',
    function (request, response) {
        User.add(request.body, function (err, dbResult) {
            if (err) {
                response.json(err);
            } else {
                //console.log("add");
                //console.log(dbResult);
                response.status(200).json("ok");
                response.end();
            }
        });
    });

module.exports = Router;