import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Search extends React.Component {
    render(){
        if(!this.props.users){
            return (<div className="wraperSearchResults"></div>);
        }
        console.log("this.props.users", this.props.users);
        const users = this.props.users.map(user => {
            return(

            <div className= "searchedUser">
            <Link to={`/user/${user.id}`}><img src={user.image} alt="image"/></Link>
            <h3>{user.firstname} {user.lastname}</h3>
            </div>
            )
        })
        if(users.length>0){
            return(
                <div className="wraperSearchResults">
                <h2>Users matching the search:</h2>
                <div className="searchResults">
                {users}
                </div>

                </div>

            )
        } else {
            return (
                <div className="wraperSearchResults">
                    <h2>No users were found!</h2>
                </div>
            )
        }
    }
}

const mapStateToProps=(state) => {
    console.log("state", state);
    return {
        //this is an array
        users: state.searchedUsers
    }
}
export default connect(mapStateToProps)(Search)
