import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import SideBar from "./Components/SideBar/SideBar";
import ToastProvider from "./Components/Contexts/toast.context";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ToastProvider>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </ToastProvider>
);
