import React from "react";
import { HashRouter, Route } from 'react-router-dom';
import Registration from "./Registration";
import Login from "./Login";

export default function Welcome (){
    return (
        <div>
            <div className="logo">
                <img src="./logo.png" alt=""/>
            </div>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>

        </div>
      )
}
