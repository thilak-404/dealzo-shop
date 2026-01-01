// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA95fy4z9s0Qn4-iVF8YzDj33iSQKegkPI",
    authDomain: "dealzo-shop.firebaseapp.com",
    projectId: "dealzo-shop",
    storageBucket: "dealzo-shop.firebasestorage.app",
    messagingSenderId: "618693206086",
    appId: "1:618693206086:web:1ed9d5bb49ecf1040b6a47"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
