import React from "react";
import axios from "./axios";
import {Link} from "react-router-dom";


export default class Registration extends React.Component{
    constructor(){
        super();
        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            password: ""
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleSubmit(){
        axios.post("/registration", this.state)
            .then(response => {
                if(response.data.success){
                    location.replace("/")
                } else {
                    this.setState({
                        error: response.data.error
                    })
                }
            })
            .catch(err => {
                console.log("there was an error");
            })
    }
    handleChange(e){
        this.setState({
            [e.target.name]:e.target.value
        }, ()=> console.log("new state ", this.state));

    }
    render(){
        const {firstname, lastname, email, password} = this.state
        return(
            <div className="wraper" >
                <div className="registration-or-login">
                <h3>New to ESCAPERS? Sign Up!</h3>
                <div className="form">
                <form>
                    {this.state.error && <div>{this.state.error}</div>}
                    <input onChange= {this.handleChange} name="firstname" type="text" placeholder="First name"/>
                    <input onChange= {this.handleChange} name="lastname" type="text" placeholder="Last name"/>
                    <input onChange= {this.handleChange} name="email" type="text" placeholder="Email"/>
                    <input onChange= {this.handleChange} name="password" type="password" placeholder="Password"/>
                    <button onClick= { (e)=> {
                        e.preventDefault();
                        this.handleSubmit()
                    }}>Register</button>

                    <h4 className="redirect">Already a member? Please <Link to="/login">log in</Link></h4>
                    <p className="policy">By signing up, you agree to ESCAPERS's Terms of Use and Privacy Policy.</p>
                </form>
            </div>
                </div>
            </div>

        )
    }
}
