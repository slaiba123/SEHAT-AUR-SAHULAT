// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDIxo7yh1vNzncydmWOXsGMNadsoE59Ogw",
  authDomain: "hospital-management-syst-e87d7.firebaseapp.com",
  projectId: "hospital-management-syst-e87d7",
  storageBucket: "hospital-management-syst-e87d7.appspot.com",
  messagingSenderId: "930369202484",
  appId: "1:930369202484:web:692816ea88e83429c05d61",
  measurementId: "G-M5P1FKHH8B"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAGVA7ubGFvbSukb_Z128hNJ5NK7OE3EuI",
//   authDomain: "hospital-system-be5d0.firebaseapp.com",
//   projectId: "hospital-system-be5d0",
//   storageBucket: "hospital-system-be5d0.appspot.com",
//   messagingSenderId: "1084971003318",
//   appId: "1:1084971003318:web:ea16856e284ffd5cc46517",
//   measurementId: "G-Z5QV1M3N98"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Storage
const storage = getStorage(app);

export { db, auth, storage };