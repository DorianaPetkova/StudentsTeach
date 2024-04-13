import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthC";
import { ChatContextProvider } from "./context/ChatC";
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();

//we wrap the root in different contexts and the query provider to ensure smooth running
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
 
  <AuthContextProvider>
    <ChatContextProvider>
    <QueryClientProvider client={queryClient}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </QueryClientProvider>
      </ChatContextProvider>
      </AuthContextProvider>
    
);