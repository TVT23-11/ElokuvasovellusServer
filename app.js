const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
var express = require('express');

const TMDB_router = require('./controllers/TMDBController');
const User_router = require('./controllers/userController');
const Groups_router = require('./controllers/groupsController');
const Favorites_router = require('./controllers/favoritesController');
const Review_router = require('./controllers/reviewController');

const App=express();
App.use(express.json());
App.use(express.urlencoded({extended:false}));

const cors = require('cors');
App.use(express.static('public'));
App.use(cors());

App.use('/TMDB', TMDB_router);
App.use('/user', User_router);
App.use('/groups', Groups_router);
App.use('/favorites', Favorites_router);
App.use('/review', Review_router);

//App.use(authenticateToken);

App.listen(process.env.PORT, function(err){
    if (err) console.log(err);
    console.log("listening port " + process.env.PORT);
});

App.get('/*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html', function (err) {
    if(err) {
      res.status(500).send(err)
    }
  })
})

module.exports=App;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    console.log("token = "+token);
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
  }