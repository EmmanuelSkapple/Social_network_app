import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore/';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import firebase from '@react-native-firebase/app';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// const firebaseSettings = {
//   apiKey: "AIzaSyC1ttEGhBKN2C5117eX8zqYQbg0gbv1yew",
//   authDomain: "typescriptmatter.firebaseapp.com",
//   projectId: "typescriptmatter",
//   storageBucket: "typescriptmatter.appspot.com",
//   messagingSenderId: "413939133404",
//   appId: "1:413939133404:web:ea6bcd5dc7d1d35ad3bd19",
//   measurementId: "G-NVG4P9ECY9",
// };

const firebaseSettings = {
  apiKey: 'AIzaSyBOx4MmSY2oY6MbXM9Fu7A7-Jr6XvqIWtw',
  authDomain: 'matter-alpha.firebaseapp.com',
  projectId: 'matter-alpha',
  storageBucket: 'matter-alpha.appspot.com',
  messagingSenderId: '102164746352',
  appId: '1:102164746352:web:4cdea34201f0bf6caee4b5',
  measurementId: 'G-5S9364R8K1',
};

export const FirebaseConfig = initializeApp(firebaseSettings,);
firebase.initializeApp(firebaseSettings);

const initialDB = initializeFirestore(FirebaseConfig, {
  experimentalAutoDetectLongPolling: true
})
//* Database
export const db = getFirestore(FirebaseConfig);

//* Storage
export const storage = getStorage(FirebaseConfig);

//* Authentication
export const auth = getAuth(FirebaseConfig);
