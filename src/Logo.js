import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { searchFriends } from "./actions";
import { connect } from "react-redux";

function Logo(props){
    let searchString;
    return (
        <div className="logo">
            <img src="/Logo.png" alt=""/>
            <div className="icons">


                <div className="search">
                    <input onChange={(e)=>{searchString=e.target.value}}type="text" className="search-query" name="search" placeholder="Search..."/>
                    <Link to="/search"><button onClick={(e) => props.dispatch(searchFriends(searchString))} type="submit">Search</button></Link>
                </div>


                <div className="online">
                    <img src="/online.png" alt=""/>
                    <p><Link to="/online-users">Online Users</Link></p>
                </div>

                <div className="chat">
                    <img src="/chat.png" alt=""/>
                    <p><Link to="/chat">Chat</Link></p>
                </div>

                <div className="friends">
                    <img src="/friends.png" alt=""/>
                    <p><Link to="/friends">My friends </Link></p>
                </div>

                <div className="myprofile">
                    <img onClick={props.togglePicUploader} src={props.profileImage} alt=""/>
                    <p><Link to="/">My profile</Link></p>
                </div>

                <div className="logout">
                    <img src="/logout.png" alt=""/>
                    <p><a href="/logout">Logout</a></p>
                </div>

            </div>

        </div>
    )
}

export default connect()(Logo)
