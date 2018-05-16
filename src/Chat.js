import React from "react";
import { connect } from "react-redux";
import { sendSingleChatMessage } from "./socket";
import { Link } from "react-router-dom";

class Chat extends React.Component {
    constructor(props){
        super(props);
        this.onKeyDown = this.onKeyDown.bind(this);
    }
    onKeyDown(e){
        console.log(e.keyCode);
        if (e.keyCode == 13){
            let msg = e.target.value
            e.target.value = ""
            sendSingleChatMessage(msg)
            e.preventDefault()

        }
    }
    componentDidMount(){

        if(this.chatContainer){

            this.chatContainer.scrollTop = 
            this.chatContainer.scrollHeight - this.chatContainer.clientHeight;
        }
    }
    componentDidUpdate(){
        console.log("this chatcontainer", this.chatContainer);
    }

    render(){
        if(!this.props.messages || !this.props.messages.length){
            console.log("inside if statement");
            return (
                <div className="chatWraper">
                    <h2>Chat Room</h2>
                    <div className="chatContainer">
                        <textarea className="typeMessage"onKeyDown={this.onKeyDown} placeholder="leave a message"></textarea>
                    </div>

                </div>)
        }
        const listOfMessages = this.props.messages.map(message =>{
            return (
                <div  className="singleChatMessage">
                    <Link to={`/user/${message.userId}`}><img src={message.image} alt=""/></Link>
                    <div className="messageText">
                        <p><strong>{message.firstname} {message.lastname}</strong> commented at {message.date}</p>
                        <p><em>{message.messageText}</em></p>
                    </div>
                </div>
            )
        })

        return(
            <div className= "chatWraper">

                <h2>Chat Room</h2>
                <div
                ref= {(elem)=>{this.chatContainer=elem}}
                className = "chatContainer">
                {listOfMessages}
                </div>
                <textarea className="typeMessage" onKeyDown={this.onKeyDown} placeholder="Leave a message"></textarea>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("state", state);
    return {
        messages: state.chatMessages || []
    }
}
export default connect(mapStateToProps)(Chat)
