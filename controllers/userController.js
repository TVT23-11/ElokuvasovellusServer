const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

    // Uuden käyttäjän lisäys
Router.post('/register',
    function (request, response) {
        User.add(request.body, function (err, dbResult) {
            if (err) {
                response.json(err);
                console.log(err);
            } else {
                //console.log("add");
                //console.log(dbResult);
                response.status(200).json("ok");
                response.end();
            }
        });
    });
Router.post('/login',
    function(request, response){
        if(request.body.username && request.body.password){
            const user = request.body.username;
            const pass = request.body.password;

            User.checkPassword(user, function(err, dbResult){
                if(err){
                    response.json(err);
                } else {
                    console.log(dbResult.rows[0].password);
                    
                    bcrypt.compare(pass, dbResult.rows[0].password, function(err,compareResult) {
                        if(compareResult) {
                          console.log("succes");
                          const token = generateAccessToken({ username: user });
                          response.json(token);
                          //response.send(token);
                        }
                        else {
                            console.log("wrong password");
                            response.json('wrong password');
                            //response.send(false);
                        }			
                    });
                    
                }
            });
        }
    });

    // Tarkistaa, onko käyttäjätunnus varattu
Router.get('/checkUsername',
    function (request, response) {
        console.log("checking username " + request.query.username);
        User.isUsernameAvailable(request.query.username, function (err, dbResult){
            if(err){
                response.json(err);
            } else {
                if(dbResult.rows.length > 0){
                    response.json('not available');
                } else {
                    response.json('available');
                }
                
            }
        });
    });

    //Tarkistaa, onko sähköpostilla jo luotu tili
Router.get('/checkEmail',
    function (request, response) {
        User.isEmailAvailable(request.query.email, function (err, dbResult){
            if(err){
                response.json(err);
            } else {
                if(dbResult.rows.length > 0){
                    response.json('not available');
                } else {
                    response.json('available');
                }
                
            }
        });
    });


function generateAccessToken(username) {
    return jwt.sign(username, process.env.JWT_SECRET_KEY, { expiresIn: '1800s' });
}

module.exports = Router;