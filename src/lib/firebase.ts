import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// It's recommended to store this configuration in environment variables
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if it hasn't been initialized yet and the config is valid
const app =
  !getApps().length && firebaseConfig.apiKey
    ? initializeApp(firebaseConfig)
    : getApps().length > 0
    ? getApp()
    : null;

if (!app) {
    console.error("Firebase configuration is missing or invalid. Make sure to set up your .env.local file with the correct Firebase credentials. The app will not function correctly without it.");
}

const auth = app ? getAuth(app) : null;
const firestore = app ? getFirestore(app) : null;

export { app, auth, firestore };
