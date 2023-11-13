import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Lander from "./Lander";
import { PeerProvider } from "./Context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PeerProvider>
      <Lander></Lander>
    </PeerProvider>
  </BrowserRouter>
);
