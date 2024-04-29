const DB = require('../database/pg_connection');
const bcrypt = require('bcrypt');
const { jwtDecode } = require('jwt-decode');

async function parseJwt (token) {
  if(token == '' || token === 'undefined'){
      return '';
  }
  return await jwtDecode(token);
}

const User = {
  add: function (newUser, callback) {
    
    var bcrypt = require('bcrypt');
    let iterations = 10;
    var salt = bcrypt.genSaltSync(iterations);
    var password = bcrypt.hashSync(newUser.password, salt);
   
    return DB.query(
      'insert into users (username, email, password, salt, iterations) values($1, $2, $3, $4, $5)',
      [newUser.username, newUser.email, password, salt, iterations],
      callback
    );

  },
  getUsername: async function (token){
    const tokenData = await parseJwt(token);
    const username = {username: tokenData.username};
    return (username);
  },
  checkPassword: function (user, callback) {
    return DB.query('select password from users where username like $1', [user], callback);
  },
  isUsernameAvailable: function (username, callback){
    return DB.query('select * from users where username like $1', [username], callback);
  },
  isEmailAvailable: function (email, callback){
    return DB.query('select * from users where email like $1', [email], callback);
  },
  getAll: function(callback) {
    return('getAll');
  },
   // Poista käyttäjä kaikista tauluista, joissa on iduser-kenttä
  deleteUser: async function (username, callback) {
     let result= await DB.query('DELETE FROM favorites WHERE iduser IN (SELECT iduser FROM users WHERE username like $1);' , [username]);
     result = await DB.query(' DELETE FROM reviews WHERE iduser IN (SELECT iduser FROM users WHERE username like $1);', [username]) ;  
     result = await DB.query(' DELETE FROM user_groups WHERE iduser IN (SELECT iduser FROM users WHERE username like $1);', [username]) ; 
     return DB.query('DELETE FROM users WHERE username like $1;' , [username], callback);                       
  },

// Käyttäjän sähköposti osoitteen päivitys
  updateEmail: function (username, newEmail, callback) {
    DB.query('UPDATE users SET email = $1 WHERE username like $2', [newEmail, username], callback);
  }
};

module.exports = User;