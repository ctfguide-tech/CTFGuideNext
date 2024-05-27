import { createContext } from "react";

export const defaultState = {
  username: "",
  setUsername: () => {},

  uid: "",
  setUid: () => {},

  profilePic: "",
  setProfilePic: () => {},

  role: "",
  setRole: () => {},
};

export const Context = createContext(defaultState);
