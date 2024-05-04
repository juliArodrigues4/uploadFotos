import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA983GHrDNq6qkFexXGu9qWt5cOC5FSn1A",
  authDomain: "appfotos-c75e2.firebaseapp.com",
  projectId: "appfotos-c75e2",
  storageBucket: "appfotos-c75e2.appspot.com",
  messagingSenderId: "981655748059",
  appId: "1:981655748059:web:b388ec8dca9d6eaa7afbfe"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const firebd  = getFirestore(app);