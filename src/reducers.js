import React from "react";

export default function(state={}, action){
    if (action.type=="RECEIVE_FRIENDS_WANNABES"){
        state = Object.assign({}, state, {
        friends: action.friends
    });
    }

    if(action.type == "ACCEPT"){
        state = {
            ...state,
            friends: state.friends.map(friend =>{
                if(friend.id != action.id) {
                    return friend;
                } else {
                    return {
                        ...friend,
                        status:2
                    }
                }
            })
        }
    }

    if(action.type == "REJECT"){
        state = {
            ...state,
            friends: state.friends.map(friend =>{
                if(friend.id != action.id) {
                    return friend;
                } else {
                    return {
                        ...friend,
                        status:3
                    }
                }
            })
        }
    }

    if(action.type == "TERMINATE"){
        state = {
            ...state,
            friends: state.friends.map(friend =>{
                if(friend.id != action.id) {
                    return friend;
                } else {
                    return {
                        ...friend,
                        status:4
                    }
                }
            })
        }
    }

    if(action.type=="ONLINE_USERS"){
        state= {
            ...state,
            users: action.users
        }
    }

    if(action.type=="USER_JOINED"){

        state= {
            ...state,
            users: [...state.users, action.user]
        }
    }

    if(action.type=="USER_LEFT"){
        console.log("inside user_left", action);
        state= {
            ...state,
            users: state.users.filter(user => user.id != action.id)

        }
    }

    if(action.type == "SHOW_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.message]
        }
    }

    if(action.type == "SHOW_MESSAGES"){
        state = {
            ...state,
            chatMessages: action.messages
        }
    }

    if(action.type == "SEARCH_USER"){
        state = {
            ...state,
            searchedUsers: action.searchedUsers.data
        }
    }

    console.log("state", state);
    return state;
}
