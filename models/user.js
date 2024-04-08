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
  getAll: function(callback) {
    console.log('users here');
    return('getAll');
  }
};
module.exports = User;