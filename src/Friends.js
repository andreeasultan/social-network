import React from "react";
import axios from "./axios";
import {receiveFriendsAndWannabes, acceptFriendRequest,rejectFriendRequest, terminateFriendREquest} from "./actions";
import { connect } from 'react-redux';

class Friends extends React.Component {

    componentDidMount(){
        this.props.dispatch(receiveFriendsAndWannabes());
    }
    render(){
        if (!this.props.listOfFriends) {
            return null;
        }
        console.log("this.props", this.props);

        const listOfPendingFriends = this.props.listOfPendingFriends.map(friend => (
            <div className="friends-or-user-container" key={friend.id}>
                <img src={friend.image} alt=""/>
                <h3>{friend.firstname} {friend.lastname}</h3>

                <button onClick={ ()=>this.props.dispatch(acceptFriendRequest(friend.id))} className="accept-or-reject-button">Accept</button>
                <button onClick={ ()=>this.props.dispatch(rejectFriendRequest(friend.id))} className="accept-or-reject-button">Reject</button>


            </div>
        ))

        const listOfFriends = this.props.listOfFriends.map(friend => (
            <div className="friends-or-user-container" key={friend.id}>
                <img src={friend.image} alt=""/>
                <h3>{friend.firstname} {friend.lastname}</h3>
                <button onClick={ ()=>this.props.dispatch(terminateFriendREquest(friend.id))} className="friendship-button">Unfriend</button>
            </div>
        ))

        return(
            <div className="wraper-frirends-or-users">
                <h2>Pending Requests:</h2>
                {listOfPendingFriends}
                <div className="separator"></div>
                <h2>My friends:</h2>
                {listOfFriends}
            </div>

        )
    }
}
const mapStateToProps=(state) => {
    console.log("state", state);
    return {
        //this is an array
        listOfFriends: state.friends && state.friends.filter(status => status.status == 2),
        listOfPendingFriends: state.friends && state.friends.filter(status => status.status == 1)
    }
}
export default connect(mapStateToProps)(Friends)
