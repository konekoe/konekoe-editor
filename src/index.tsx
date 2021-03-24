import React from "react";
import ReactDOM from "react-dom";
import store, { Store } from "./state/store";
import App from "./App";
import { Provider } from "react-redux";

ReactDOM.render(
<Provider store={ store }>
  <App />
</Provider>, document.getElementById("root"));

if (window["Cypress"]) {
  window["store"] = store;
}