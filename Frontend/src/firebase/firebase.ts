// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaEgwitUMXR8UD2cfyjQ3kAwmMb3WUgoo",
  authDomain: "drp55-70849.firebaseapp.com",
  projectId: "drp55-70849",
  storageBucket: "drp55-70849.appspot.com",
  messagingSenderId: "474211798637",
  appId: "1:474211798637:web:9636e92b93ebc610913964",
  measurementId: "G-9NK91N1BZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//const analytics = getAnalytics(app);

export { app,auth };