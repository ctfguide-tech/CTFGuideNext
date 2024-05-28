import { createContext } from "react";

export const defaultState = {
  username: "",
  setUsername: () => {},

  profilePic: "",
  setProfilePic: () => {},

  role: "",
  setRole: () => {},
};

export const Context = createContext(defaultState);
