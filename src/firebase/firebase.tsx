import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnRYNm0jSJcfUidWXIK94DDGijcC7XfAA",
  authDomain: "library-monitoring-syste-741eb.firebaseapp.com",
  projectId: "library-monitoring-syste-741eb",
  storageBucket: "library-monitoring-syste-741eb.appspot.com", // ✅ fixed
  messagingSenderId: "13691810191",
  appId: "1:13691810191:web:f61fd1616a411203af9bfa",
  measurementId: "G-QHGVFT5YP0"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
