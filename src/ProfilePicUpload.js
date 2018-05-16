import React from "react";
import axios from "./axios";

export default class ProfilePicUpload extends React.Component {
    constructor(props) {
        console.log("props", props);
        super(props);
        this.state = {
            profilePic: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.files[0]
            },
            () => {
                console.log("new state ", this.state);
            }
        );
    }
    handleSubmit(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append("file", this.state.profilePic);
        axios.post("/upload-pic", formData).then(response => {
            console.log("axios response", response);
            this.props.setProfileImage(response.data.image);
        });
    }

    render() {
        return (
            <div className="wraperUpload">
                <div className="pic-upload">
                    <button className= "close" onClick={this.props.togglePicUploader}>x</button>
                    <h2>Upload a New Image</h2>

                    <form>
                    <input
                    onChange={this.handleChange}
                    type="file"
                    name="profilePic"
                    />
                    <button onClick={this.handleSubmit}>Upload</button>
                    </form>
                </div>

            </div>

        )
    }
}
