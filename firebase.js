import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAC4B0wwB1J2U_ottlQ68vlPBXCxXUPEr8",
  authDomain: "newproj-4d288.firebaseapp.com",
  projectId: "newproj-4d288",
  storageBucket: "newproj-4d288.appspot.com",
  messagingSenderId: "595700055553",
  appId: "1:595700055553:web:e70be2d98bef800c6e4a00"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const firebd  = getFirestore(app);
