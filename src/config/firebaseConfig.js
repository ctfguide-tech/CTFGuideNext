/*
    © CTFGuide Corporation
*/

import { initializeApp } from 'firebase/app';
//import { getAnalytics } from "firebase/analytics";

/*
        This code is intended to be public. This is public facing client information.
        It isn't some secret key or anything. It's just a way for our auth service (Firebase) to identify the app.
*/

//
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APP_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_APP_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_APP_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_APP_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurmentId: process.env.NEXT_PUBLIC_APP_MEASURMENT_ID,
};

//console.log(firebaseConfig);

// Initialize Firebase
// const app = initializeApp(firebaseConfig);


// const firebaseConfig = {
//   apiKey: "AIzaSyBLAN84VP3jSA5dqhrU6Bjmfu5NiUDuNw4",
//   authDomain: "cyberjags-8b081.firebaseapp.com",
//   databaseURL: "https://cyberjags-8b081.firebaseio.com",
//   projectId: "cyberjags-8b081",
//   storageBucket: "cyberjags-8b081.appspot.com",
//   messagingSenderId: "166652277588",
//   appId: "1:166652277588:web:e08b9e19916451e14dcec1",
//   measurementId: "G-7ZNKM9VFN2"
// };
/**
const firebaseConfig = {
  apiKey: 'AIzaSyBLAN84VP3jSA5dqhrU6Bjmfu5NiUDuNw4',
  authDomain: 'cyberjags-8b081.firebaseapp.com',
  databaseURL: 'https://cyberjags-8b081.firebaseio.com',
  projectId: 'cyberjags-8b081',
  storageBucket: 'cyberjags-8b081.appspot.com',
  messagingSenderId: '166652277588',
  appId: '1:166652277588:web:e08b9e19916451e14dcec1',
  measurementId: 'G-7ZNKM9VFN2',
};
*/

const app = initializeApp(firebaseConfig);

// make a function to check if the cookie exists
// if it does, then set the auth token to the cookie

// Initialize Firebase

//const analytics = getAnalytics(app);
