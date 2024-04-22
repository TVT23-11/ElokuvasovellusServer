const DB = require('../database/pg_connection');

const GROUPS = {
    // Lisää uusi ryhmä
    add: function (groupData, callback) {
        console.log(groupData);
        DB.query('INSERT INTO groups (name, description, date) values ($1,$2,$3)', [groupData.name, groupData.description, groupData.date], callback);
    },

    // Hae kaikki ryhmät
    getAll: function (callback) {
        DB.query('SELECT * FROM groups', callback);
    },

    // Hae ryhmä id:n perusteella
    getById: function (id, callback) {
        DB.query('SELECT * FROM groups WHERE idgroup = $1', [id], callback);
        
    },

    // Päivitä ryhmä id:n perusteella
    update: function (id, newData, callback) {
        const { name, description, date } = newData;
        DB.query('UPDATE groups SET name = $1, description = $2, date = $3 WHERE idgroup = $4', [name, description, date, id], callback);
    },


    // Poista ryhmä id:n perusteella
    delete: function (id, callback) {
        DB.query('DELETE FROM groups WHERE idgroup = $1', [id], callback);
    }
};

module.exports = GROUPS;