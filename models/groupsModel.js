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
    // Pyydä ryhmäänpääsyä
    requestGroupMembership: async function (groupData, callback) {
        if(groupData.token == ''){
            const error = {error: 'User not found'};
            callback(error);
        } else{
            const tokenData = await parseJwt(groupData.token); //puretaan tokenin payload luettavaan muotoon
            const username = tokenData.username;
            const groupId = groupData.group; 
            console.log(groupData);
            DB.query('INSERT INTO user_groups (iduser, idgroup) values ((select iduser from users where username like $1), $2)', [username, groupId], callback);
        }
        
    },
    // Lisätään elokuva ryhmän elokuvalistalle
    addToMovieList: async function (groupData, callback) {
        let result = await DB.query('select * from groups_lists where idgroup = $1 and movieid = $2;',[groupData.group, groupData.movieid]);
        if(result.rowCount > 0){
            const error = {error: 'Show is already in the list'};
            console.log(error);
            callback(error);
        } else {
            console.log('INSERT INTO groups_lists (idgroup, moviename, movieid, poster) values ($1, $2, $3, $4);', [groupData.group, groupData.moviename, groupData.movieid, groupData.poster]);
            DB.query('INSERT INTO groups_lists (idgroup, moviename, movieid, poster) values ($1, $2, $3, $4);', [groupData.group, groupData.moviename, groupData.movieid, groupData.poster], callback);
        };
        
    },
    // Lisätään esitys ryhmän esityslistalle
    addToShowList: async function (groupData, callback) {
        let result = await DB.query('select * from groups_shows where idgroup = $1 and theater like $2 and showtime like $3 and movieid = $4;',[groupData.group, groupData.theater, groupData.showtime, groupData.movieid]);
        if(result.rowCount > 0){
            const error = {error: 'Show is already in the list'};
            console.log(error);
            callback(error);
        } else {
            console.log('INSERT INTO groups_shows (idgroup, theater, showtime, moviename, movieid, poster) values ($1, $2, $3, $4, $5, $6);', [groupData.group, groupData.theater, groupData.showtime, groupData.moviename, groupData.movieid, groupData.poster]);
            DB.query('INSERT INTO groups_shows (idgroup, theater, showtime, moviename, movieid, poster) values ($1, $2, $3, $4, $5, $6);', [groupData.group, groupData.theater, groupData.showtime, groupData.moviename, groupData.movieid, groupData.poster], callback);
        };
        
    },
    // Hae käyttäjän hallinnoimien ryhmien liittymispyynnöt hyväksyttäväksi
    joinRequests: async function (token, callback) {
        if(token == ''){
            const error = {error: 'User not found'};
            callback(error);
        }
        else{
            const tokenData = await parseJwt(token); //puretaan tokenin payload luettavaan muotoon
            const username = tokenData.username;
            DB.query('select groups.name as groupname, users.username, user_groups.iduser, user_groups.idgroup from user_groups join groups on user_groups.idgroup = groups.idgroup join users on user_groups.iduser = users.iduser where user_groups.idgroup in (select idgroup from user_groups where iduser = (select iduser from users where username like $1) and isadmin = true) and user_groups.accepted = false order by groups.name;', [username], callback);
        }
        
    },
    // Hyväksy käyttäjä ryhmään
    acceptToGroup: async function (groupData, callback) {
        if(groupData === 'undefined'){
            const error = {error: 'User not found'};
            callback(error);
        }
        else{
            const user = groupData.user;
            const group = groupData.group;
            DB.query('update user_groups set accepted=true, joined_at=now() where iduser = $1 and idgroup = $2;', [user, group], callback);
        }
        
    },
    // Poista käyttäjän liittymispyyntö
    denyFromGroup: async function (user, group, callback) {
        if(user === 'undefined' || user ==''){
            const error = {error: 'User not found'};
            callback(error);
        }
        else{
            DB.query('delete from user_groups where iduser = $1 and idgroup = $2;', [user, group], callback);
        }
        
    },
    // Listaa ryhmät ja kirjautuneen käyttäjän liittymisen status
    listGroups: async function (token, callback) {
        let tokenData = await parseJwt(token);
        let username = tokenData.username;
        DB.query('select groups.idgroup, groups.description, groups.name, (select count(user_groups.idusergroup) from user_groups where groups.idgroup = user_groups.idgroup and user_groups.iduser = (select iduser from users where username like $1)) as isMember, (select user_groups.accepted from user_groups where groups.idgroup = user_groups.idgroup and user_groups.iduser = (select iduser from users where username like $1)) as isAccepted from groups;', [username], callback);
    },
    // Listaa ryhmät ja kirjautuneen käyttäjän liittymisen status
    groupDetails: async function (id, token, callback) {
        let error = '';
        let tokenData = await parseJwt(token);
        let username = tokenData.username;

        let group = await DB.query('select idgroup, name as groupname, description from groups where idgroup = $1;', [id]);
        if(group.rowCount < 1){
            error = 'Group not found';
        }
        let groupMovieList = await DB.query('select * from groups_lists where idgroup = $1', [id]);
 
        //Ryhmän esityksille täytyy tehdä kantaan taulu
        let groupShowList = await DB.query('select * from groups_shows where idgroup = $1', [id]);
        console.log(groupShowList);

        let groupMembers = await DB.query('select iduser as id, username from users where iduser in (select iduser from user_groups where idgroup = $1) order by username;', [id]);

        let isAdmin = await DB.query('select count(idgroup) as admin from user_groups where isadmin = true and iduser = (select iduser from users where username like $1) and idgroup = $2', [username, id]);

        let user = await DB.query('select iduser from users where username like $1', [username]);

        let data = {
            id: group.rows[0].idgroup,
            groupname: group.rows[0].groupname,
            description: group.rows[0].description,
            groupMovieList: groupMovieList.rows,
            groupShowList: groupShowList.rows,
            groupMembers: groupMembers.rows,
            admin: isAdmin.rows[0].admin,
            user: user.rows[0].iduser
        };
        if(error == ''){
            callback(false, data);
        } else {
            callback({error: error});
        }
        
    },
    // Heataan ne ryhmät, joihin käyttäjä on ylläpitäjä
    isAdminToGroups: async function (token, callback) {
        let tokenData = await parseJwt(token);
        let username = tokenData.username;
        console.log(username);
        DB.query('select idgroup as id, name from groups where idgroup in (select idgroup from user_groups where iduser in (select iduser from users where username like $1) and isadmin = true);', [username], callback);
        
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