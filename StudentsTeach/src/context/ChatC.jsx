import React, { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthC";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  const INITIAL_STATE = {
    chatId: "null",
    user: {},
    server: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
          server: {}, // Reset server info when changing to a user chat
        };
      case "CHANGE_SERVER":
        return {
          server: action.payload,
          chatId: action.payload.id, // Use server id as chatId for server chat
          user: {}, // Reset user info when changing to a server chat
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
