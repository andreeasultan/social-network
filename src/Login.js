import React from "react";
import axios from "./axios";
import {Link} from "react-router-dom";

export default class Login extends React.Component{
    constructor(){
        super()
        this.state = {
            email: "",
            password: ""
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleSubmit(){
        axios.post("/login", this.state).then(response =>{
            if(response.data.success){
                console.log("success");
                location.replace("/")

            } else {
                console.log("it didn't work!!!!");
                this.setState({
                    error: response.data.error
                })
            }
        })
    }

    handleChange(e){
        this.setState({
            [e.target.name]:e.target.value
        }, ()=> console.log("new state ", this.state));
    }
    render(){
        const {email, password} = this.state
        return (
            <div className="wraper">
                <div className="registration-or-login">
                <div className="form"></div>
                    <form>
                        {this.state.error && <div>{this.state.error}</div>}
                        <input onChange={this.handleChange} type="text" name="email" placeholder="Email Adress"/>
                        <input onChange={this.handleChange} type="password" name="password" placeholder="Password"/>
                        <button onClick={(e) => {
                            e.preventDefault();
                            this.handleSubmit()
                        }}>Sign In</button>
                        <p className="redirect">Not registered yet? Please <Link to="/">sign up</Link></p>
                    </form>

                </div>

            </div>

        )
    }

}
