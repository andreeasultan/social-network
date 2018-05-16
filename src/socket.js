import * as io from "socket.io-client";
import {onlineUsers, userJoined, userLeft,chatMessages, chatMessage} from "./actions"
import {store} from "./start"
//they can be synchronous, no ajax request needed in the actions
let socket;

export function initSocket(){
    if(!socket){
        socket= io.connect();
        socket.on("onlineUsers", function(users){
            store.dispatch(onlineUsers(users))
        })
        socket.on("userJoined", function(user){
            console.log("received socket event user joined", user);
            store.dispatch(userJoined(user))
        })

        socket.on("userLeft", function(id){
            store.dispatch(userLeft(id))
        })
        socket.on("chats", function(messages){
            console.log("messages", messages);
            store.dispatch(chatMessages(messages))
        })

        socket.on("chat", function(message){
            console.log("message", message);
            store.dispatch(chatMessage(message))
        })
    }
}

export function sendSingleChatMessage(message) {
    socket.emit("chatMessage", message)
}
