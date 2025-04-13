import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";

console.log(
  "Redux store defined:", !!store,
  "State:", store?.getState?.(),
  "React version:", React.version,
); // Enhanced debug log

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Root;