require('dotenv').config();
const {Pool} = require('pg');

const pgPool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_UNAME,
    password: process.env.PG_PW,
    ssl: true
});

pgPool.connect( (err) => {
    if(err){
        console.log(err.message)
    }else{
        console.log("Yhteys valmis")
    }
});

module.exports = pgPool;