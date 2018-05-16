import React from "react";
import Logo from "./Logo";
import Profile from "./Profile";
import ProfilePicUpload from "./ProfilePicUpload";
import OtherProfile from "./OtherProfile";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Friends from "./Friends";
import OnlineUsers from "./OnlineUsers";
import Chat from "./Chat";
import Search from "./Search";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            showUploader: false,
            showUpdater: false,
            profilePicUrl: "/User.png",
            bio: "What kind of traveller are you?"
        };
        this.togglePicUploader = this.togglePicUploader.bind(this);
        this.toggleBioUpdater = this.toggleBioUpdater.bind(this);
        this.setProfileImage = this.setProfileImage.bind(this);
        this.setBio = this.setBio.bind(this);
    }
    togglePicUploader() {
        console.log("running toggleUploader");
        this.setState({ showUploader: !this.state.showUploader });
    }
    toggleBioUpdater(){
        console.log("running toogleBioUpdater");
        this.setState({ showUpdater: !this.state.showUpdater})

    }
    setProfileImage(image) {
        this.setState({
            profilePicUrl: image,
            showUploader: false
        });
    }
    setBio(bio) {
        this.setState({
            bio: bio,
            showUpdater: false
        })
    }
    componentDidMount() {
        axios
            .get("/user")
            .then(response => {
                if (response.data.success) {
                    this.setState({
                        firstname: response.data.results.firstname,
                        lastname: response.data.results.lastname,
                        email: response.data.results.email,
                        profilePicUrl:
                            response.data.results.image ||
                            this.state.profilePicUrl,
                        bio: response.data.results.bio || this.state.bio
                    });
                } else {
                    this.setState({
                        error: response.data.error
                    });
                }
            })
            .catch(err => {
                console.log("error");
            });
    }
    render() {
        const { firstname, lastname, email, profilePicUrl, bio, showUpdater, showUploader } = this.state;
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Logo
                            profileImage={profilePicUrl}
                            togglePicUploader={this.togglePicUploader}/>

                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    togglePicUploader={this.togglePicUploader}
                                    toggleBioUpdater={this.toggleBioUpdater}
                                    showUpdater={showUpdater}
                                    showUploader={showUploader}
                                    setBio={this.setBio}
                                    firstname={firstname}
                                    lastname={lastname}
                                    profilePicUrl={profilePicUrl}
                                    bio={bio}
                                />
                            )}
                        />

                        {this.state.showUploader && (
                            <ProfilePicUpload
                                setProfileImage={this.setProfileImage}
                                togglePicUploader={this.togglePicUploader}
                                 />
                        )}
                        <Route exact path="/user/:id" component={OtherProfile} />
                        <Route exact path="/friends" component = {Friends} />
                        <Route exact path = "/online-users" component = {OnlineUsers} />
                        <Route exact path = "/chat" component = {Chat} />
                        <Route exact path = "/search" component = {Search} />

                    </div>
                </BrowserRouter>
            </div>



        );
    }
}
