import React from "react";
import { Provider } from "react-redux";
import store from "./state/store";

const App: React.FC = () => (
  <Provider store={ store }>
    <div>
      I am test.
    </div>
  </Provider>
);

export default App;