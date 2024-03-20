import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthC";
import { ChatContextProvider } from "./context/ChatC";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
 
  <AuthContextProvider>
    <ChatContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
      </ChatContextProvider>
      </AuthContextProvider>
    
);