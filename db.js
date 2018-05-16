var spicedPg = require("spiced-pg");
let dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    var { dbUser, dbPass } = require("./secrets.json");
    dbUrl = `postgres:${dbUser}:${dbPass}@localhost:5432/socialnetwork`;
}

var db = spicedPg(dbUrl);

function userRegistration(firstname, lastname, email, hashed_password) {
    return db
        .query(
            `INSERT INTO users
                    (firstname, lastname, email, hashed_password)
                     VALUES ($1, $2, $3, $4) RETURNING *`,
            [firstname, lastname, email, hashed_password]
        )
        .then(function(results) {
            return results;
        });
}

function checkRegistration(typedEmail) {
    return db
        .query("SELECT * FROM users where email=$1", [typedEmail])
        .then(function(results) {
            return results;
        });
}

function getUserData(id) {
    return db
        .query("SELECT*FROM users where id=$1", [id])
        .then(function(results) {
            return results;
        });
}

function saveProfilePic(image, id) {
    return db
        .query("UPDATE users SET image=$1 WHERE id=$2 RETURNING*", [image, id])
        .then(function(results) {
            return results;
        });
}

function saveBio(bio, id) {
    return db
        .query("UPDATE users SET bio=$1 WHERE id=$2 RETURNING*", [bio, id])
        .then(function(results) {
            return results;
        });
}

function getOtherProfile(id) {
    return db
        .query("SELECT*FROM users WHERE id=$1", [id])
        .then(function(results) {
            return results.rows[0];
        });
}

function getFriendshipStatus(userId, otherUserId) {
    return db
        .query(
            `SELECT status, sender_id AS sender, receiver_id AS receiver
                    FROM friendships
                    WHERE (sender_id=$1 OR receiver_id=$1)
                    AND (sender_id=$2 OR receiver_id=$2)
                    AND (status=1 OR status=2)`,
            [userId, otherUserId]
        )
        .then(function(results) {
            let status;
            if (!results.rows.length) {
                status = 0;
            } else {
                status = results.rows[0].status;
            }
            return {
                status,
                sender: (results.rows[0] && results.rows[0].sender) || null,
                receiver: (results.rows[0] && results.rows[0].receiver) || null
            };
        });
}

function makeFriendRequest(userId, otherUserId) {
    return db
        .query(
            `INSERT INTO friendships (status, sender_id, receiver_id) VALUES(1, $1,$2) RETURNING*`,
            [userId, otherUserId]
        )
        .then(function(results) {
            return results.rows[0];
        });
}

function cancelFriendRequest(userId, otherUserId) {
    return db
        .query(
            `UPDATE friendships SET status=5 WHERE sender_id=$1 AND receiver_id=$2 RETURNING*`,
            [userId, otherUserId]
        )
        .then(function(results) {
            console.log("cancelling", results);
            return results.rows[0];
        });
}

function acceptFriendRequest(otherUserId, userId) {
    return db
        .query(
            `UPDATE friendships SET status=2 WHERE sender_id=$1 AND receiver_id=$2 RETURNING*`,
            [otherUserId, userId]
        )
        .then(function(results) {
            console.log("accepting", results);
            return results.rows[0];
        });
}

function rejectFriendRequest(otherUserId, userId) {
    return db
        .query(
            `UPDATE friendships SET status=3 WHERE sender_id=$1 AND receiver_id=$2 RETURNING*`,
            [otherUserId, userId]
        )
        .then(function(results) {
            console.log("accepting", results);
            return results.rows[0];
        });
}

function terminateFriendship(otherUserId, userId) {
    return db
        .query(
            `UPDATE friendships SET status=4
            WHERE (sender_id=$1 OR receiver_id=$1)
            AND (sender_id=$2 OR receiver_id=$2) RETURNING*`,
            [otherUserId, userId]
        )
        .then(function(results) {
            console.log("terminating", results);
            return results.rows[0];
        });
}

function getFriendsAndWannebes(userId) {
    return db
        .query(
            `SELECT users.id, firstname, lastname, image, status
            FROM friendships
            JOIN users
            ON (status = 1 AND receiver_id = $1 AND sender_id = users.id)
            OR (status = 2 AND receiver_id = $1 AND sender_id = users.id)
            OR (status = 2 AND sender_id = $1 AND sender_id = users.id)`,
            [userId]
        )
        .then(function(results) {
            console.log("getting friends", results);
            return results.rows;
        });
}

function onlineUsers(arrayOfUsersIds) {
    return db
        .query(`SELECT * FROM users WHERE id = ANY($1)`, [arrayOfUsersIds])
        .then(function(results) {
            // console.log("gettining online users short version", results.rows);
            //do not send back the password
            return results.rows;
        });
}

function connectedUser(userId) {
    return db
        .query(`SELECT * FROM users WHERE id = $1`, [userId])
        .then(function(results) {
            // console.log("gettining connected user short version ", results.rows);
            //do not send back the password
            return results.rows[0];
        });
}

function searchFriends(searchString) {
    return db
        .query(
            `SELECT id, image, firstname, lastname FROM users
                        WHERE firstname ILIKE $1 OR lastname ILIKE $1`,
            [searchString+"%"]
        )
        .then(function(results) {
            console.log("searchFriends",results.rows);
            return results.rows;
        });
}

module.exports = {
    userRegistration,
    checkRegistration,
    getUserData,
    saveProfilePic,
    saveBio,
    getOtherProfile,
    getFriendshipStatus,
    makeFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    terminateFriendship,
    getFriendsAndWannebes,
    rejectFriendRequest,
    onlineUsers,
    connectedUser,
    searchFriends
};
