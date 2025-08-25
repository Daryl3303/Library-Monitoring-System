import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserIdState] = useState<string | null>(null);

 
  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    if (storedUser) {
      setUserIdState(storedUser);
    }
  }, []);


  const setUserId = (id: string | null) => {
    if (id) {
      localStorage.setItem("userId", id);
    } else {
      localStorage.removeItem("userId");
    }
    setUserIdState(id);
  };

  const logout = () => {
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, setUserId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
