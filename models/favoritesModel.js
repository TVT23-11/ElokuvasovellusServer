const DB = require('../database/pg_connection');
const { jwtDecode } = require('jwt-decode');

async function checkExistingFavorite(username, idmovie) {
    const result = await DB.query('SELECT * FROM favorites WHERE iduser = (select iduser from users where username like $1) AND idmovie = $2', [username, idmovie]);
    return result.rowCount > 0;
}

async function parseJwt (token) {
    if(token == ''){
        return '';
    }
    return jwtDecode(token);
}

const Favorites = {
    // Hae kaikki suosikit
    getAll: function (token, callback) {
        if(token.length < 3){
            const error = {error: 'User not found'};
            callback(error);
        } else{
        const tokenData = jwtDecode(token);
        const username = tokenData.username;    
        DB.query('Select * FROM favorites where iduser = (select iduser from users where username like $1) ',[username], callback);
    }
    },
    // Lisää suosikki
        addFavorite: async function (favoriteData, callback) {
        if(favoriteData.token.length < 3){
            const error = {error: 'User not found'};
            callback(error);
        } else{
            const tokenData = jwtDecode(favoriteData.token);
            const username = tokenData.username;

            const idmovie = favoriteData.id;
            const movieName = favoriteData.movie;
            const poster = favoriteData.poster;
            DB.query('insert into favorites (iduser, idmovie, moviename, poster) values ((select iduser from users where username like $1), $2, $3, $4)', [username, idmovie, movieName, poster], callback);
        }
    },
    // Poista suosikki
    delete: async function (token, movie, callback){
        const tokenData = jwtDecode(token);
        const username = tokenData.username;
        console.log(username, movie);
        DB.query('delete from favorites where iduser = (select iduser from users where username like $1) and idmovie = $2', [username, movie], callback);
    }
};



module.exports = Favorites;
