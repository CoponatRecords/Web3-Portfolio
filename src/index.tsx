import React from "react";
import { store } from "./redux/store";
import App from "./App";

console.log(
  "Redux store defined:", !!store,
  "State:", store?.getState?.(),
  "React version:", React.version,
); // Enhanced debug log

const Root = () => (
    <App />
);

export default Root;