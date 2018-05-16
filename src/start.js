import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import Welcome from "./Welcome";
import {initSocket} from "./socket";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducers";
export const store = createStore(
   reducer,
   composeWithDevTools(applyMiddleware(reduxPromise))
);
import { composeWithDevTools } from "redux-devtools-extension";

const elem = (
   <Provider store={store}>
       <App />
   </Provider>
);

let router;

if(location.pathname !="/welcome"){
    initSocket();
}

if (location.pathname == "/welcome") {
    router = <Welcome />
} else {
    router = elem;
}

ReactDOM.render(router, document.querySelector("main"));
