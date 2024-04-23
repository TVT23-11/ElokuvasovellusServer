const DB = require('../database/pg_connection');
const { jwtDecode } = require('jwt-decode');

async function checkGroupName(name){
    if(name ==''){
        return false;
    }
    const result = await DB.query('SELECT * FROM groups WHERE name like $1', [name]);
    if(result.rowCount > 0){
        return false
    }
    return true;
}

async function parseJwt (token) {
    //return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if(token == ''){
        return '';
    }
    return jwtDecode(token);
}

const GROUPS = {
    // Lisää uusi ryhmä
    add: async function (groupData, callback) {
        if (groupData.name == '') {
            const error = { error: 'Group name cannot be empty' };
            callback(error);
        }
        else {
            const nameIsAvailable = await checkGroupName(groupData.name);
            if (nameIsAvailable) {
                const tokenData = await parseJwt(groupData.token); //puretaan tokenin payload luettavaan muotoon
                if(tokenData != ''){
                        const result = await DB.query('INSERT INTO groups (name, description) values ($1,$2) RETURNING idgroup', [groupData.name, groupData.description]);
                    if (result.rowCount > 0) { //Rivin lisäys onnistui
                        //Lisätään käyttäjä ryhmään admin -oikeudella
                        DB.query('INSERT INTO user_groups (iduser, idgroup, accepted, isadmin) values ((select iduser from users where username like $1), $2, true, true)', [tokenData.username, result.rows[0].idgroup], callback);
                    } else {
                        const error = { error: 'Group name not available' };
                        callback(error);
                    }
                }
                else{
                    const error = { error: 'User not found' };
                    callback(error);
                }
            }
            else {
                const error = { error: 'Group name not available' };
                callback(error);
            }
        }
    },
    requestGroupMembership: async function (groupData, callback) {
        if(groupData.token == ''){
            const error = {error: 'User not found'};
            callback(error);
        }
        else{
            const tokenData = await parseJwt(groupData.token); //puretaan tokenin payload luettavaan muotoon
            const username = tokenData.username;
            const groupId = groupData.group; 
            console.log(groupData);
            return DB.query('INSERT INTO user_groups (iduser, idgroup) values ((select iduser from users where username like $1), $2)', [username, groupId], callback);
        }
        
    },
    joinRequests: async function (token, callback) {
        if(token == ''){
            const error = {error: 'User not found'};
            callback(error);
        }
        else{
            const tokenData = await parseJwt(token); //puretaan tokenin payload luettavaan muotoon
            const username = tokenData.username;
            return DB.query('select groups.name as groupname, users.username, user_groups.iduser, user_groups.idgroup from user_groups join groups on user_groups.idgroup = groups.idgroup join users on user_groups.iduser = users.iduser where user_groups.idgroup in (select idgroup from user_groups where iduser = (select iduser from users where username like $1) and isadmin = true) and user_groups.accepted = false order by groups.name;', [username], callback);
        }
        
    },
    acceptToGroup: async function (groupData, callback) {
        if(groupData === 'undefined'){
            const error = {error: 'User not found'};
            callback(error);
        }
        else{
            const user = groupData.user;
            const group = groupData.group;
            return DB.query('update user_groups set accepted=true, joined_at=now() where iduser = $1 and idgroup = $2', [user, group], callback);
        }
        
    },

    // Liittymispyyntö ryhmään
    listGroups: async function(token, callback){
        let tokenData = await parseJwt(token);
        let username = tokenData.username; 
        DB.query('select groups.idgroup, groups.description, groups.name, (select count(user_groups.idusergroup) from user_groups where groups.idgroup = user_groups.idgroup and user_groups.iduser = (select iduser from users where username like $1)) as isMember, (select user_groups.accepted from user_groups where groups.idgroup = user_groups.idgroup and user_groups.iduser = (select iduser from users where username like $1)) as isAccepted from groups;', [username], callback);
        //const error = {error: 'Function not yet implemented', gropRequested: groupData.group};
        //callback(error);
    },

    // Hae kaikki ryhmät
    getAll: function (callback) {
        DB.query('SELECT * FROM groups', callback);
    },

    // Hae ryhmä id:n perusteella
    getById: function (id, callback) {
        DB.query('SELECT * FROM groups WHERE idgroup = $1', [id], callback);
        
    },

    // Hae ryhmä id:n perusteella
    getByName: function (name, callback) {
        DB.query('SELECT * FROM groups WHERE name like $1', [name], callback);
        
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