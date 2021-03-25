import React from "react";
import ReactDOM from "react-dom";
import store from "./state/store";
import App from "./App";
import { Provider } from "react-redux";
import { GlobalWindow } from "./types";

ReactDOM.render(
<Provider store={ store }>
  <App />
</Provider>, document.getElementById("root"));

if ((window as GlobalWindow)["Cypress"]) {
  (window as GlobalWindow)["store"] = store;
}