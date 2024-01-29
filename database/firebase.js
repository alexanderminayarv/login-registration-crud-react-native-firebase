import { initializeApp } from 'firebase/app';
import { initializeFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyCMC7KrEplZLwZ5ouzq5fhPWk_iEfZ-DOo",
  authDomain: "hello-peter-2b8ce.firebaseapp.com",
  databaseURL: "https://hello-peter-2b8ce-default-rtdb.firebaseio.com",
  projectId: "hello-peter-2b8ce",
  storageBucket: "hello-peter-2b8ce.appspot.com",
  messagingSenderId: "682138235994",
  appId: "1:682138235994:web:9370b064e7c826ecc75463",
  measurementId: "G-L005WDH016"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
})
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, db, auth };
