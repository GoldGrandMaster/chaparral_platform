import React from "react";
import { Provider } from 'react-redux'
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import store from './redux/store'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
