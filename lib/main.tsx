import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider as JotaiProvider } from "jotai";
import "@fontsource/inter";
import "@fontsource-variable/jetbrains-mono/wght-italic.css";
import "@fontsource-variable/jetbrains-mono";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <JotaiProvider>
      <App />
    </JotaiProvider>
  </React.StrictMode>
);
