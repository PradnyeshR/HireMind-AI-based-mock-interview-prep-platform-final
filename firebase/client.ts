// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC0h5iYobbJwBgA-NpKoHBjf70fbU7fCBY",
    authDomain: "prepwise-d6297.firebaseapp.com",
    projectId: "prepwise-d6297",
    storageBucket: "prepwise-d6297.firebasestorage.app",
    messagingSenderId: "835490744186",
    appId: "1:835490744186:web:cbea6c6bf885434bd7b8c3",
    measurementId: "G-NRW58Y37R3"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC0h5iYobbJwBgA-NpKoHBjf70fbU7fCBY",
//   authDomain: "prepwise-d6297.firebaseapp.com",
//   projectId: "prepwise-d6297",
//   storageBucket: "prepwise-d6297.firebasestorage.app",
//   messagingSenderId: "835490744186",
//   appId: "1:835490744186:web:cbea6c6bf885434bd7b8c3",
//   measurementId: "G-NRW58Y37R3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
