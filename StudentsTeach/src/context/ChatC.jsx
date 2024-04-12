import React, { createContext, useContext, useReducer, useState } from "react";
import { AuthContext } from "./AuthC";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  const INITIAL_STATE = {
    chatId: "null",
    user: {},
    server: {},
  };

  const [isListening, setIsListening] = useState(false);

  const chatReducer = (state, action) => {
    console.log(action.type);
    switch (action.type) {
      case "CHANGE_USER":
        const { displayName, ...rest } = action.payload; // Extracting displayName
        return {
          user: rest, // Setting user object without displayName
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
          server: {},
        };
      case "CHANGE_SERVER":
        return {
          server: action.payload,
          chatId: action.payload.id,
          user: {},
        };
      case "UPDATE_USER_DISPLAY_NAME":
        return state;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch, isListening, setIsListening }}>
      {children}
    </ChatContext.Provider>
  );
};
