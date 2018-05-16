import React from "react";
import { connect } from 'react-redux';
import {onlineUsers, userJoined, userLeft} from "./actions";
import { Link } from "react-router-dom";

class OnlineUsers extends React.Component {

    render(){
        const listOfUsers = this.props.listOfUsers.map(user => {
            return(
                <div className="friends-or-user-container" key={user.id}>
                    <Link to={`/user/${user.id}`}><img src={user.image} alt=""/></Link>
                    <h3>{user.firstname} {user.lastname}</h3>
                </div>

            )
        })
        return(
            <div className="wraper-frirends-or-users">
            <h2>Online now:</h2>
            {listOfUsers}
            </div>
        )
    }
}

const mapStateToProps=(state) => {
    console.log("state", state);
    return {
        listOfUsers: state.users || []
    }
}
export default connect(mapStateToProps)(OnlineUsers)
