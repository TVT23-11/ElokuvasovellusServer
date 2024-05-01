const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { jwtDecode } = require('jwt-decode');

async function parseJwt(token) {
    return jwtDecode(token);
}


// Uuden käyttäjän lisäys
Router.post('/register',
    async function (request, response) {
        if (request.body) {
            User.add(request.body, function (err, dbResult) {
                if (err) {                 
                    if(err.constraint == 'users_username_key'){
                        response.status(401).json({ error: 'username not avaialbe' });
                    } else if(err.error){
                        response.status(401).json({ error: err.error });
                    } else {
                        console.log(err);
                        response.status(404).json({ error: 'jotain meni pieleen' });
                    }

                } else {
                    response.status(200).json("ok");
                }
            });
        } else {
            response.status(401).json({ error: 'incomplete user data' });
        }
        
    });

Router.post('/login',
    function (request, response) {
        if (request.body.username && request.body.password) {
            const user = request.body.username;
            const pass = request.body.password;

            User.checkPassword(user, function (err, dbResult) {
                if (err) {
                    response.json(err);
                } else {  
                    if (dbResult.rowCount > 0) {    // Käyttäjätili löytyi   
                        bcrypt.compare(pass, dbResult.rows[0].password, async function (err, compareResult) {
                            if (err) {
                                console.log(err);
                                json.status(404).json({ error: err });
                            } else {
                                if (compareResult) {
                                    const token = await jwt.sign({ username: user }, process.env.JWT_SECRET_KEY);
                                    response.status(200).json({ jwtToken: token });
                                } else {
                                    console.log("wrong password");
                                    response.status(401).json({ error: 'wrong password' });
                                }
                            }
                        });
                    } else {
                        console.log('Käyttäjätunnusta ei löytynyt tietokannasta');
                        response.status(404).json({ error: 'wrong password' });
                    }   
                }
            });
        } else {
            console.log('Käyttäjätunnusta tai salasanaa ei löytynyt post-datasta');
            response.status(404).json({ error: 'wrong password' });
        }
        //response.end();
    });

// Tarkistaa, onko käyttäjätunnus varattu
Router.get('/checkUsername',
    function (request, response) {
        if(request.query.username){
            User.isUsernameAvailable(request.query.username, function (err, dbResult) {
            if (err) {
                response.json(err);
            } else {
                if (dbResult.rows.length > 0) {
                    response.status(401).json('not available');
                } else {
                    response.status(200).json('available');
                }

            }
        });
        } else {
            response.status(404).json({error: 'data not found'});
        }

        
    });

Router.get('/getUsername',
    async function (request, response){
        if (request.query.token && request.query.token != '' && request.query.token !== 'undefined') {
            const result = await User.getUsername(request.query.token);
            if (result.username) {
                response.status(200).json(result);
            }
            else {
                response.status(404).json({error: 'user not found'});
            }
        } else {
            response.status(404).json({error: 'user not found'});
            console.log('user not found');
        }
        
    });

    Router.get('/getUserId',
    async function (request, response){
        if (request.query.token && request.query.token != '' && request.query.token !== 'undefined') {
            const result = await User.getUserId(request.query.token);
            if (result.iduser) {
                response.status(200).json(result);
            }
            else {
                response.status(404).json({error: 'user not found'});
            }
        } else {
            response.status(404).json({error: 'user not found'});
            console.log('user not found');
        }
        
    });

Router.get('/getEmail/',
    async function (request, response) {
        if (request.query.token && request.query.token != '' && request.query.token !== 'undefined') {
            const result = await User.getEmail(request.query.token);
            if (result.email) {
                response.status(200).json(result);
            }
            else {
                console.log('user not found');
                response.status(404).json({ error: 'user not found' });
            }
        } else {
            response.status(404).json({ error: 'user not found' });
            console.log('user not found');
        }

    });

//Tarkistaa, onko sähköpostilla jo luotu tili
Router.get('/checkEmail',
    function (request, response) {
        if (request.query.email) {
            User.isEmailAvailable(request.query.email, function (err, dbResult) {
                if (err) {
                    response.status(404).json(err);
                } else {
                    if (dbResult.rows.length > 0) {
                        response.status(401).json('not available');
                    } else {
                        response.status(200).json('available');
                    }

                }
            });
        } else {
            response.status(404).json({error: 'data not found'});
        }
        
    });

// Käyttäjätilin poisto
Router.delete('/',
    async function (request, response) {
        if(request.query.id){
            let tokendata = await parseJwt(request.query.id);
            let username = tokendata.username;
            User.deleteUser(username, function (err, dbResult) {
                if (err) {
                    response.json(err);
                } else {
                    if (dbResult.rowCount > 0) {
                        response.status(200).json('Käyttäjätili poistettiin onnistuneesti');
                    } else {
                        response.status(404).json('Käyttäjätiliä ei löytynyt');
                    }
                }
            });
        } else {
            response.status(404).json('Käyttäjätiliä ei löytynyt');
        }
        
    });

//Sähköpostin vaihto 
Router.put('/changeEmail', async function (request, response) {
    try {
        if(request.query.id && request.query.newEmail){
            let tokendata = await parseJwt(request.query.id);
            let newEmail = request.query.newEmail; // Saadaan uusi sähköposti 
            //Tarkastetaan onko uusi sähköposti jo käytössä
            User.isEmailAvailable(newEmail, async function (err, dbResult) {
                if (err) {
                    console.log(err);
                    response.status(401).json(err);
                } else {
                    if (dbResult.rows.length > 0) {
                        
                    //console.log('Uusi sähköposti on jo käytössä');
                        response.status(401).json('Uusi sähköposti on jo käytössä');
                    } else {

                        let username = tokendata.username;

                        User.updateEmail(username, newEmail, function (err, dbResult) {
                            if (err) {
                                response.json(err);
                            } else {
                                response.status(200).json('Sähköposti vaihdettu onnistuneesti');
                                //console.log(dbResult);
                            }
                        });
                    }
                }
            });
        } else {
            response.status(404).json({error: 'incomplete data'});
        }
        
    } catch (error) {
        console.log('oot huono');
        response.status(401).json({ error: 'oot huono' });
    }
});



function generateAccessToken(username) {
    return jwt.sign(username, process.env.JWT_SECRET_KEY, { expiresIn: '1800s' });
}

module.exports = Router;