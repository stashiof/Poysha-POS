import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue, get, set, update, push, remove } from 'firebase/database';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBeAEsuacInlrQx05C1uDtqL0DeFzRojMY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "stashio-6b332.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://stashio-6b332-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "stashio-6b332",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "stashio-6b332.firebasestorage.app",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const rtdb = getDatabase(app);
export const dbFirestore = getFirestore(app);

export {
  app,
  ref,
  onValue,
  get,
  set,
  update,
  push,
  remove,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs
};
