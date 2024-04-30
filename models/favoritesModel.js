const DB = require('../database/pg_connection');
const { jwtDecode } = require('jwt-decode');

async function checkExistingFavorite(username, idmovie) {
    const result = await DB.query('SELECT * FROM favorites WHERE iduser = (SELECT iduser FROM users WHERE username LIKE $1) AND idmovie = $2', [username, idmovie]);
    return result.rowCount > 0;
}

async function parseJwt(token) {
    if (token === '') {
        return '';
    }
    return jwtDecode(token);
}

const Favorites = {
    // Hae kaikki suosikit
    getAll: function (token, callback) {
        if (token.length < 3) {
            const error = { error: 'User not found' };
            callback(error);
        } else {
            const tokenData = jwtDecode(token);
            const username = tokenData.username;
            DB.query('SELECT * FROM favorites WHERE iduser = (SELECT iduser FROM users WHERE username LIKE $1)', [username], callback);
        }
    },

    // Lisää suosikki
    addFavorite: async function (favoriteData, callback) {
        if (favoriteData.token.length < 3) {
            const error = { error: 'User not found' };
            callback(error);
        } else {
            const tokenData = jwtDecode(favoriteData.token);
            const username = tokenData.username;

            const idmovie = favoriteData.id;
            const movieName = favoriteData.movie;
            const poster = favoriteData.poster;

            DB.query('INSERT INTO favorites (iduser, idmovie, moviename, poster) VALUES ((SELECT iduser FROM users WHERE username LIKE $1), $2, $3, $4)', [username, idmovie, movieName, poster], callback);
        }
    },

    // Poista suosikki
    delete: async function (token, movie, callback) {
        const tokenData = jwtDecode(token);
        const username = tokenData.username;

        DB.query('DELETE FROM favorites WHERE iduser = (SELECT iduser FROM users WHERE username LIKE $1) AND idmovie = $2', [username, movie], callback);
    },

    // Tallenna jakamislinkki suosikkilistaan
    getFavoriteList: async function (iduser, callback) {
    const result = await DB.query('select * from favorites where iduser = $1', [iduser]);
    if(result.rowCount > 0){
        return result.rows;
    }else{
        return {error:'user not found'};
    }
    
}
};

module.exports = Favorites;
