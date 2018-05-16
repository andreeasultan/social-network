import React from "react";
import {Link} from "react-router-dom";
import Bio from "./Bio"

export default function Profile(props){
    console.log("props in profile", props);
    function showBio(){
        console.log("props", props);
        if (props.bio === "What kind of traveller are you?"){
            return(
                <div>
                    <button onClick={props.toggleBioUpdater}>Add Bio</button>
                        {props.showUpdater &&
                        <Bio
                        setBio={props.setBio} bio={props.bio}
                        />}
                </div>
            )
        } else {
            return(
                <div>
                    <p>{props.bio}</p>
                    <button onClick={props.toggleBioUpdater}>Edit</button>
                    {props.showUpdater &&
                    <Bio
                    setBio={props.setBio} bio={props.bio}/>}
                </div>
            )

        }
    }

    return (
        <div className="wraper-profile">
            <div className="profile-container">
                <h1>Welcome, {props.firstname}!</h1>
                <div className="profile-data">
                <div className="profile-image">
                    <img onClick={props.togglePicUploader} src={props.profilePicUrl} alt={`${props.firstname} ${props.lastname}`}/>
                </div>
                <div className="profile-text">
                    <h3>Your Profile Information:</h3>
                    <h4>Name: {`${props.firstname} ${props.lastname}`}</h4>
                    {showBio()}
                </div>



                </div>

            </div>

        </div>
    )
}
