import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZ8dOGJOJ0At4h0yPBYx32tpjVU04n6ZM",
  authDomain: "deukway-a7350.firebaseapp.com",
  projectId: "deukway-a7350",
  storageBucket: "deukway-a7350.firebasestorage.app",
  messagingSenderId: "1060999049263",
  appId: "1:1060999049263:web:aa080659a81ee8773096da",
  measurementId: "G-WXW31XBX7K",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);