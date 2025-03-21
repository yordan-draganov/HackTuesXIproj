import { initializeApp, getApps, getApp } from "firebase/app";
import {
	getAuth,
	setPersistence,
	browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyD7a8nxXt5v_qpx_IAQ3a2412bEJrbNxLM",
	authDomain: "investingdb.firebaseapp.com",
	projectId: "investingdb",
	storageBucket: "investingdb.firebasestorage.app",
	messagingSenderId: "726153301115",
	appId: "1:726153301115:web:daae2104ea9d7dc7f0e6de",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export const db = getFirestore(app);
