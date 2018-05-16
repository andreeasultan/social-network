import React from "react";
import axios from "./axios";

export default class Bio extends React.Component {
    constructor() {
        console.log("something");
        super();
        this.state = {
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        e.preventDefault(e);
        this.setState({ [e.target.name]: e.target.value }, () =>
            console.log("new state ", this.state)
        );
    }
    handleSubmit() {
        if(!this.state.bio) {
            this.props.setBio(this.props.bio)
            return
        }
        axios.post("/save-bio", this.state).then(response => {
            this.props.setBio(response.data.bio);
        });
    }
    render() {
        return (
            <div className="bio-edit">
                <textarea type="text" onChange={this.handleChange} name="bio" defaultValue={this.props.bio || this.state.bio}/>
                <button onClick={this.handleSubmit}>Save</button>

            </div>
        );
    }
}
