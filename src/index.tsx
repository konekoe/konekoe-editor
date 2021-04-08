import React from "react";
import ReactDOM from "react-dom";
import store from "./state/store";
import App from "./App";
import { Provider } from "react-redux";
import { GlobalWindow } from "./types";
import { TEST_WS_ADDRESS } from "../constants";

ReactDOM.render(
<Provider store={ store }>
  <App
    serverAddress={ (document.getElementById("root") as HTMLElement).dataset.messageTarget || TEST_WS_ADDRESS }
    token={ (document.getElementById("root") as HTMLElement).dataset.authToken || "" }
    store={ store }  
  />
</Provider>, document.getElementById("root"));

if ((window as GlobalWindow)["Cypress"]) {
  (window as GlobalWindow)["store"] = store;
}