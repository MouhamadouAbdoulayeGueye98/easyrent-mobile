import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";


export async function getUserRole(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));

  if (userDoc.exists()) {
    return userDoc.data();
  }

  return null;
}
// =========================
// INSCRIPTION CLIENT
// =========================

export async function registerClient(data) {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,

    role: "client",

    firstName: data.firstName,

    email: data.email,

    createdAt: serverTimestamp(),
  });

  return user;
}

// =========================
// INSCRIPTION ANNONCEUR
// =========================

export async function registerPublisher(data) {

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );


  const user = userCredential.user;


  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,

      role: "publisher",

      publisherType: data.publisherType,

      firstName: data.firstName,

      lastName: data.lastName,

      phone: data.phone,

      city: data.city,

      email: data.email,

      createdAt: serverTimestamp(),
    }
  );


  return user;
}

// =========================
// CONNEXION
// =========================

export async function login(email, password) {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return userCredential.user;
}

// =========================
// DECONNEXION
// =========================

export async function logout() {
  await signOut(auth);
}

// =========================
// MOT DE PASSE OUBLIE
// =========================

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}