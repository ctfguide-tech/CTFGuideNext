/*
    © CTFGuide Corporation
*/


import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

/*
        This code is intended to be public. This is public facing client information.
        It isn't some secret key or anything. It's just a way for our auth service (Firebase) to identify the app.
*/

const firebaseConfig = {
  apiKey: "AIzaSyAHz1s-UuNhlZ6aKvqwzmzzidzWxBKw9hw",
  authDomain: "ctfguide-dev.firebaseapp.com",
  projectId: "ctfguide-dev",
  storageBucket: "ctfguide-dev.appspot.com",
  messagingSenderId: "792987058367",
  appId: "1:792987058367:web:c48935325e46043c3cc60a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
