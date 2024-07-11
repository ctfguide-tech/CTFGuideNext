import { createContext } from "react";

export const defaultState = {
  username: "",
  setUsername: () => { },

  profilePic: "",
  setProfilePic: () => { },

  role: "",
  setRole: () => { },

  points: "",
  setPoints: () => { }

};

export const Context = createContext(defaultState);
