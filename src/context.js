import { createContext } from "react";

export const defaultState = {
  username: "",
  setUsername: () => { },

  accountType: "",
  setAccountType: () => { },

  profilePic: "",
  setProfilePic: () => { },

  role: "",
  setRole: () => { },

  points: "",
  setPoints: () => { }

};

export const Context = createContext(defaultState);
