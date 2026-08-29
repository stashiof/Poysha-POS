import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue, get, set, update, push, remove } from 'firebase/database';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBeAEsuacInlrQx05C1uDtqL0DeFzRojMY",
  authDomain: "stashio-6b332.firebaseapp.com",
  databaseURL: "https://stashio-6b332-default-rtdb.firebaseio.com",
  projectId: "stashio-6b332",
  storageBucket: "stashio-6b332.firebasestorage.app",
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
