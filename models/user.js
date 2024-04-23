const DB = require('../database/pg_connection');
const bcrypt = require('bcrypt');

const User = {
  add: function (newUser, callback) {
    
    var bcrypt = require('bcrypt');
    let iterations = 10;
    var salt = bcrypt.genSaltSync(iterations);
    var password = bcrypt.hashSync(newUser.password, salt);

    /*
    Kirjautumisen validointi:

    if(bcrypt.compareSync("Käyttäjän antama salasana tulee tähän", password)){
      console.log('ok');
    }
    else{
      console.log('ei ok');
    }

    */
    
    return DB.query(
      'insert into users (username, email, password, salt, iterations) values($1, $2, $3, $4, $5)',
      [newUser.username, newUser.email, password, salt, iterations],
      callback
    );

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
    console.log('users here');
    return('getAll');
  },
   // Poista käyttäjä kaikista tauluista, joissa on iduser-kenttä
  deleteUser: async function (username, callback) {
    console.log(username);
    
    // DELETE FROM favorites WHERE iduser IN (SELECT iduser FROM users WHERE username like $1);  DELETE FROM reviews WHERE iduser IN (SELECT iduser FROM users WHERE username like $1); DELETE FROM user_groups WHERE iduser IN (SELECT iduser FROM users WHERE username like $1)', [username], callback);
     let result= await DB.query('DELETE FROM favorites WHERE iduser IN (SELECT iduser FROM users WHERE username like $1);' , [username]);
     result = await DB.query(' DELETE FROM reviews WHERE iduser IN (SELECT iduser FROM users WHERE username like $1);', [username]) ;  
     result = await DB.query(' DELETE FROM user_groups WHERE iduser IN (SELECT iduser FROM users WHERE username like $1);', [username]) ; 
     return DB.query('DELETE FROM users WHERE username like $1;' , [username], callback);                       
  }
};

module.exports = User;