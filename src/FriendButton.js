import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component{

    constructor(props){
        super(props);
        this.renderButtonText=this.renderButtonText.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    handleSubmit(){
        if (this.props.friendshipStatus == 0 || this.props.friendshipStatus == 5 || this.props.friendshipStatus == 3 || this.props.friendshipStatus == 4){
            axios.post(`/make-request/${this.props.match.params.id}`).then(response =>{
                console.log("just made a friend request", response);
                this.props.resetFriendshipStatus(response.data.results)
            })
        } else if(this.props.friendshipStatus == 1){
            if(this.props.match.params.is == this.props.receiverId) {
                axios.post(`/cancel-request/${this.props.match.params.id}`).then(response =>{
                    console.log("just canceled a friend request");
                    this.props.resetFriendshipStatus(response.data.results)
                })
            } else if(this.props.match.params.id !== this.props.receiverId){
                axios.post(`/accept-request/${this.props.match.params.id}`).then(response =>{
                    console.log("just accepted a friend request", response);
                    this.props.resetFriendshipStatus(response.data.results)
                })
            }
        } else if(this.props.friendshipStatus == 2){
            axios.post(`/terminate-friendship/${this.props.match.params.id}`).then(response =>{
                console.log("just terminated a friendship", response);
                this.props.resetFriendshipStatus(response.data.results)
            })
        }
}
    renderButtonText(){
        let text;
        console.log("render button props", this.props);
        if (this.props.friendshipStatus == 0){
            text = "Add Friend"
        } else if (this.props.friendshipStatus == 1) {
            if(this.props.match.params.id == this.props.receiverId) {
                text = "Cancel"
            } else if (this.props.match.params.id !== this.props.receiverId){
                text= "Accept"
            }
        } else if(this.props.friendshipStatus == 2){
            text = "Unfriend"
        } else if(this.props.friendshipStatus == 3){
            text = "Add Friend"
        } else if(this.props.friendshipStatus == 4){
            text= "Add Friend"
        } else if(this.props.friendshipStatus == 5){
            text = "Add Friend"
        }
        return text;
    }
    render(){
            console.log("inside rendering button", this.props);
        return(

            <button className="friendship-button" onClick={this.handleSubmit}>{this.renderButtonText()}</button>
        )
    }
}
