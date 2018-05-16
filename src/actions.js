import axios from './axios';

export function receiveFriendsAndWannabes() {
    return axios.get('/friends-and-wannabes').then(function({ data }) {
        console.log("data", data);
        return {
            type: 'RECEIVE_FRIENDS_WANNABES',
            friends: data.data
        };
    });
}

export function acceptFriendRequest(id) {
    console.log("hello everybody");
    return axios.post('/accept-request/' + id).then(function({data}) {
        return {
            type: 'ACCEPT',
            id: id
        };
    });
}

export function rejectFriendRequest(id) {
    console.log("hello everybody");
    return axios.post('/accept-request/' + id).then(function({data}) {
        return {
            type: 'REJECT',
            id: id
        };
    });
}

export function terminateFriendREquest(id) {
    return axios.post('/terminate-friendship/' + id).then(function() {
        return {
            type: 'TERMINATE',
            id: id
        };
    });
}

export function onlineUsers(users){
    return {
        type: "ONLINE_USERS",
        users: users
    }
}

export function userJoined(user){
    return {
        type: "USER_JOINED",
        user:user
    }
}

export function userLeft(id){
    return {
        type: "USER_LEFT",
        id: id
    }
}

export function chatMessages (messages){
    return{
        type: "SHOW_MESSAGES",
        messages: messages

    }
}

export function chatMessage (message){
    return {
        type: "SHOW_MESSAGE",
        message: message

    }
}

export function searchFriends(searchString){
    return axios.get(`/search/${searchString}`).then(function(data){
        console.log("searchFriends", data.data);
        return {
            type: "SEARCH_USER",
            searchedUsers: data.data
        }
    })

}
