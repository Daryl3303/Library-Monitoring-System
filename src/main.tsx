import React from 'react'
import ReactDOM from 'react-dom/client'
import SignIn from './components/SignIn.tsx'
import SignUp from './components/SignUp.tsx'
import Admin from './components/Admin.tsx'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext.tsx";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAnRYNm0jSJcfUidWXIK94DDGijcC7XfAA",
  authDomain: "library-monitoring-syste-741eb.firebaseapp.com",
  projectId: "library-monitoring-syste-741eb",
  storageBucket: "library-monitoring-syste-741eb.firebasestorage.app",
  messagingSenderId: "13691810191",
  appId: "1:13691810191:web:f61fd1616a411203af9bfa",
  measurementId: "G-QHGVFT5YP0"
};
initializeApp(firebaseConfig);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
          
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <AuthProvider>
          <Route path="/admin" element={<Admin />} />
          </AuthProvider>
          <Route path="*" element={<Navigate to="/signIn" />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
