// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "daylight-vmt00",
  "appId": "1:822834733602:web:83820453b80b62cdf7a07b",
  "storageBucket": "daylight-vmt00.firebasestorage.app",
  "apiKey": "AIzaSyBrO9Ru0CJYU8p0ofcNXDdnRa8zNcZ8TUw",
  "authDomain": "daylight-vmt00.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "822834733602"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
