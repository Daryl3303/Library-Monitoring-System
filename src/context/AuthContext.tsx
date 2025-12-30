import { createContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../firebase/firebase";

interface AuthContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // First check if there's an admin login in localStorage
    const storedUserId = localStorage.getItem("userId");
    const adminFlag = localStorage.getItem("isAdmin");

    if (storedUserId && adminFlag === "true") {
      // Admin logged in via Firestore (no Firebase Auth)
      setUserIdState(storedUserId);
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    // Listen for Firebase Auth changes (for teachers & students)
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // Teacher or Student logged in via Firebase Auth
        setUserIdState(user.uid);
        setIsAdmin(false);
      } else {
        // No user logged in
        setUserIdState(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setUserId = (id: string | null) => {
    setUserIdState(id);
    const adminFlag = localStorage.getItem("isAdmin");
    
    if (id) {
      localStorage.setItem("userId", id);
      setIsAdmin(adminFlag === "true");
    } else {
      localStorage.removeItem("userId");
      localStorage.removeItem("isAdmin");
      setIsAdmin(false);
    }
  };

  const logout = async () => {
    // If user is logged in via Firebase Auth (teacher/student), sign out
    if (!isAdmin && auth.currentUser) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Firebase sign out error:", error);
      }
    }
    
    // Clear all auth data
    setUserIdState(null);
    setIsAdmin(false);
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider value={{ userId, setUserId, logout, loading, isAdmin }}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      )}
    </AuthContext.Provider>
  );
};