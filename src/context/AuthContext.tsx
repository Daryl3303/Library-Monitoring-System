import { createContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../firebase/firebase";

type AuthType = "admin" | "user" | null;

interface AuthContextType {
  userId: string | null;
  adminId: string | null;
  authType: AuthType;
  loginAdmin: (adminId: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [authType, setAuthType] = useState<AuthType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔴 PRIORITY 1: ADMIN SESSION (NO FIREBASE)
    const storedAdminId = localStorage.getItem("adminId");
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");

    if (storedAdminId && adminLoggedIn === "true") {
      setAdminId(storedAdminId);
      setAuthType("admin");
      setLoading(false);
      return;
    }

    // 🔵 PRIORITY 2: FIREBASE USER SESSION
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserId(user.uid);
        setAuthType("user");
      } else {
        setUserId(null);
        setAuthType(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔐 ADMIN LOGIN (manual)
  const loginAdmin = (id: string) => {
    localStorage.setItem("adminId", id);
    localStorage.setItem("adminLoggedIn", "true");

    setAdminId(id);
    setAuthType("admin");
  };

  // 🚪 LOGOUT (both types)
  const logout = async () => {
    if (authType === "user" && auth.currentUser) {
      await signOut(auth);
    }

    localStorage.removeItem("adminId");
    localStorage.removeItem("adminLoggedIn");

    setUserId(null);
    setAdminId(null);
    setAuthType(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        adminId,
        authType,
        loginAdmin,
        logout,
        loading,
      }}
    >
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
