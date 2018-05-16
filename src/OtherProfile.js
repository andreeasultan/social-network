import React from "react";
import axios from "./axios";
import FriendButton from "./FriendButton";


export default class OtherProfile extends React.Component{
     constructor(){
         super()
         this.state={
             firstname: "",
             lastname: "",
             email: "",
             profilePicUrl: "/User.png",
             bio: "",
             friendshipStatus:"",

         }
         this.resetFriendshipStatus=this.resetFriendshipStatus.bind(this);
     }
     componentDidMount(){
         axios.get(`/get-user/${this.props.match.params.id}`).then(response=>{
             if(response.data.otherProfile){
                 this.setState({
                     firstname: response.data.newObj.firstname,
                     lastname: response.data.newObj.lastname,
                     email: response.data.newObj.email,
                     profilePicUrl: response.data.newObj.image ||this.state.profilePicUrl,
                     bio: response.data.newObj.bio,
                     friendshipStatus: response.data.newObj.friendshipStatus.status,
                     senderId:response.data.newObj.friendshipStatus.sender,
                     receiverId:response.data.newObj.friendshipStatus.receiver,
                     //how to set the state when on frienship status 0?

                 })
                      console.log("this.state ", this.state);
             } else {
                 return this.props.history.push("/")
             }
         })
     }
     resetFriendshipStatus(results){
         this.setState({
             friendshipStatus:results.status,
             senderId:results.sender_id,
             receiverId:results.receiver_id
         }, ()=> console.log("new state", this.state));

     }
     render(){
         const{firstname, lastname, email, profilePicUrl, bio, friendshipStatus, senderId, receiverId} = this.state
         return(
             <div className="wraper-profile">
                 <div className="profile-container">
                     <h1>{firstname} {lastname}</h1>
                     <FriendButton
                        friendshipStatus = {friendshipStatus}
                        senderId = {senderId}
                        receiverId = {receiverId}
                        resetFriendshipStatus = {this.resetFriendshipStatus}
                        match = {this.props.match}
                      />
                     <div className="profile-data">
                     <img src={this.state.profilePicUrl} alt={`${firstname} ${lastname}`}/>
                         <div className="profile-text">
                         <h3>Profile Information:</h3>
                         <h4>Name: {`${firstname} ${lastname}`}</h4>
                         <h4>Email: {email}</h4>
                         <h4>Bio: {bio}</h4>
                         </div>
                     </div>
                 </div>
             </div>

         )
     }

 }
