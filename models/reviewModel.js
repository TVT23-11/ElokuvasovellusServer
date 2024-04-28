const DB = require('../database/pg_connection');
const { jwtDecode } = require('jwt-decode');

async function parseJwt (token) {
    if(token == ''){
        return '';
    }
    return jwtDecode(token);
}

const Review = {
    // Hae kaikki ryhmät
    getAll: function (callback) {
        DB.query('SELECT reviews.*, users.username FROM reviews join users on reviews.iduser = users.iduser', callback);
    },
    // Hyväksy käyttäjä ryhmään
    addReview: async function (reviewData, callback) {
        if(reviewData.token.length < 3){
            const error = {error: 'User not found'};
            callback(error);
        } else{
            const tokenData = jwtDecode(reviewData.token);
            const username = tokenData.username;

            const idmovie = reviewData.id;
            const movieName = reviewData.movie;
            const poster = reviewData.poster;
            const reviewText = reviewData.reviewText;
            const stars = reviewData.stars;
            DB.query('insert into reviews (iduser, idmovie, moviename, poster, review, numberofstars) values ((select iduser from users where username like $1), $2, $3, $4, $5, $6)', [username, idmovie, movieName, poster, reviewText, stars], callback);
        }
    }
};

module.exports = Review;