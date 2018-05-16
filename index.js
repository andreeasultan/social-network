const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./db");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const csurf = require("csurf");
const s3 = require("./s3");
const config = require("./config.json");
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("public"));

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(
//     cookieSession({
//         secret: process.env.SESSION_SECRET || require("./secrets").secret,
//         maxAge: 1000 * 60 * 60 * 24 * 14
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: process.env.SESSION_SECRET || require("./secrets").secret,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

function checkPassword(plainTextPassword, hashedPasswordDb) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(plainTextPassword, hashedPasswordDb, function(
            err,
            doesMatch
        ) {
            if (err) {
                console.log("error");
                reject(err);
            } else {
                console.log("success", doesMatch);
                resolve(doesMatch);
            }
        });
    });
}

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("/welcome", (req, res) => {
    if (req.session.user) {
        return res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/registration", (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        res.json({
            success: false,
            error: "It looks you missed something. Try again!"
        });
    } else {
        hashPassword(password).then(hash => {
            console.log("hash", hash);
            db
                .userRegistration(firstname, lastname, email, hash)
                .then(results => {
                    req.session.user = {
                        id: results.rows[0].id,
                        firstname: results.rows[0].firstname,
                        lastname: results.rows[0].lastname,
                        email: results.rows[0].email
                    };
                    res.json({ success: true });
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        success: false,
                        error: "Oups, something went wrong. Try again!"
                    });
                });
        });
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.json({
            success: false,
            error: "It looks you missed something. Try again!"
        });
    } else {
        db.checkRegistration(email).then(results => {
            return checkPassword(password, results.rows[0].hashed_password)
                .then(doesMatch => {
                    if (doesMatch) {
                        req.session.user = {
                            id: results.rows[0].id,
                            firstname: results.rows[0].firstname,
                            lastname: results.rows[0].lastname,
                            email: results.rows[0].email
                        };
                        res.json({ success: true });
                    } else {
                        res.json({
                            success: false,
                            error:
                                "Your email address or password is not correct. Try again!"
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        success: false,
                        error: "Somehting went wrong. Try again!"
                    });
                });
        });
    }
});

//======================LOGGED IN USER SETS PROFILE====================
app.post("/upload-pic", uploader.single("file"), s3.upload, (req, res) => {
    console.log("req.file is", req.file);
    if (req.file) {
        db
            .saveProfilePic(req.file.filename, req.session.user.id)
            .then(results => {
                console.log(
                    "inside POST/upload-pic, received results ",
                    results
                );
                res.json({ image: config.s3Url + req.file.filename });
            });
    } else {
        console.log("error");
    }
});

app.post("/save-bio", (req, res) => {
    db.saveBio(req.body.bio, req.session.user.id).then(results => {
        res.json({
            bio: results.rows[0].bio,
            success: true
        });
    });
});

app.get("/user", (req, res) => {
    db.getUserData(req.session.user.id).then(results => {
        if (results.rows[0].image) {
            results.rows[0].image = config.s3Url + results.rows[0].image;
        }
        res.json({
            success: true,
            results: {
                firstname: results.rows[0].firstname,
                lastname: results.rows[0].lastname,
                image: results.rows[0].image,
                bio: results.rows[0].bio
            }
        });
    });
});

//================LOGGED IN USER ACCESSES ANOTHER USER PROFILE================
app.get("/get-user/:id", (req, res) => {
    if (req.session.user.id !== req.params.id) {
        console.log("inside if statement");
        Promise.all([
            db.getOtherProfile(req.params.id),
            db.getFriendshipStatus(req.session.user.id, req.params.id)
        ])
            .then(([otherUserInfo, friendshipStatus]) => {
                console.log(
                    "results from promise.all",
                    otherUserInfo,
                    friendshipStatus
                );
                const newObj = Object.assign({}, otherUserInfo, {
                    friendshipStatus
                });
                if (newObj.image) {
                    newObj.image = config.s3Url + newObj.image;
                }
                res.json({ newObj: newObj, otherProfile: true });
            })
            .catch(error => {
                console.log("there was an error", error);
            });
    } else {
        res.json({
            success: false
        });
    }
});

//========HANDLING DIFFERNT STAGES OF FRIEND REQUEST==================

app.post("/make-request/:id", (req, res) => {
    console.log("inside make request");
    db.makeFriendRequest(req.session.user.id, req.params.id).then(results => {
        res.json({ success: true, results: results });
    });
});

app.post("/cancel-request/:id", (req, res) => {
    console.log("inside cancel request");
    db.cancelFriendRequest(req.session.user.id, req.params.id).then(results => {
        res.json({ success: true, results: results });
    });
});

app.post("/accept-request/:id", (req, res) => {
    console.log("inside accept request");
    db.acceptFriendRequest(req.params.id, req.session.user.id).then(results => {
        res.json({ success: true, results: results });
    });
});

app.post("/reject-request/:id", (req,res)=>{
    console.log("inside areject request");
    db.rejectFriendRequest(req.params.id, req.session.user.id).then(results => {
        res.json({success:true, results: results})
    })
})

app.post("/terminate-friendship/:id", (req,res)=>{
    console.log("inside terminating friendship");
    db.terminateFriendship(req.params.id, req.session.user.id).then(results => {
        res.json({success:true, results:results})
    })
})
//================FRIENDS PAGE========================================

app.get("/friends-and-wannabes", (req,res)=>{
    console.log("inside friends-and-wannabes");
    db.getFriendsAndWannebes(req.session.user.id).then(results=> {
        //loop only if there is a picture
        results.forEach(friend => {
            friend.image = config.s3Url + friend.image
        })
        console.log("results friends-wannabes", results);
        res.json({data:results, succes:true})

    })
})

//===================SEARCH FUNCTION====================

app.get("/search/:string", (req,res)=> {
    db.searchFriends(req.params.string).then(results =>{
        results.forEach(user=>{
            if(user.image){
                user.image = config.s3Url + user.image;
            } else {
                user.image = "/User.png";
            }
        })
        res.json({data: results})
    })
})
//===============GENERIC ROUTE========================================

app.get("*", function(req, res) {
    if (!req.session.user) {
        return res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//====================SOCKET IO========================================

let onlineUsers=[];
let messages=[];

io.on("connection", function (socket){
    console.log(`socket with the id ${socket.id} is now conected`);
    // messages = []

    if (!socket.request.session || !socket.request.session.user) {
      return socket.disconnect(true);
    }
    //===============EMIT EVENT TO SHOW ALL ONLINE USERS=====================

    const userId = socket.request.session.user.id;

    onlineUsers.push({
        userId,
        socketId: socket.id
    });
    console.log("this is the list of current online users" , onlineUsers);
    let ids = onlineUsers.map(onlineUser => onlineUser.userId)
    // console.log("ids", ids);

    db.onlineUsers(ids).then(results =>{
            results.forEach(user => {
                if(user.image){
                    user.image = config.s3Url + user.image
                } else {
                    user.image = "/User.png"
                }
            })
        socket.emit("onlineUsers", results)

    }).catch(err => {
        console.log("there was an error in all online joining");
    })

    //==============EMIT EVENT TO SHOW WHEN SINGLE USER JOINED================

    // console.log("ids before filtering", ids);
    ids = ids.filter(id => id == userId)
    // console.log("ids after the filtering" ,ids);


    if (ids.length == 1) {
        db.connectedUser(userId)
        .then(user => {
            console.log("inside connectedUser - image ", user.image);
            if(user.image){
                user.image = config.s3Url + user.image
            }
            socket.broadcast.emit("userJoined", user)
        }).catch(err => {
            console.log("there was an error in single user joining", err);
        })

    }

    //==============EMIT EVENT TO SHOW WHEN SINGLE USER LEFT==================
    socket.on("disconnect", function(){
        console.log(`socket with the id ${socket.id} is now disconected`);
        // forgot to remove the userLeft from the onlineUsers
        const userLeft = onlineUsers.filter(user => user.socketId == socket.id)
        onlineUsers = onlineUsers.filter(user => {
            return user.socketId != socket.id
        })
        console.log("onlineUsers before emit", onlineUsers);
        console.log("userleft", userLeft);
        onlineUsers.forEach(user=> {
            if (userId !== user.userId) {
               io.sockets.emit("userLeft", userLeft[0].userId)
            }
        })
    })

    //=======================CHAT===================

    socket.on("chatMessage", message => {
        db.connectedUser(userId).then( user =>{
            console.log("connectedUser", user);
            console.log("inside chatMessage - image", user.image);
            if(user.image){
                user.image = config.s3Url + user.image
            } else {
                user.image = "/User.png"
            }
            messageData = {
                userId,
                messageText: message,
                date: new Date(),
                firstname: user.firstname,
                lastname: user.lastname,
                image: user.image
            }
            console.log("messageData", messageData);

            messages.push(messageData)
            console.log(messages);

            io.sockets.emit("chat", messageData)

        })
    })
    console.log("what'sup here?");
    socket.emit("chats", messages)

})


server.listen(8080, function() {
    console.log("I'm listening.");
});
