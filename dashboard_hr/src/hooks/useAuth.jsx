import { useState, useEffect, useContext, createContext } from "react";

// Bagian: Auth Context
const AuthContext = createContext();

// Bagian: Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bagian: Load User from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin");
    if (token && admin) {
      setUser(JSON.parse(admin));
    }
    setLoading(false);
  }, []);

  // Bagian: Sign In
  const signIn = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Bagian: Store Token and Admin
      localStorage.setItem("token", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      setUser(data.admin);

      return { success: true };
    } catch (error) {
      return { error };
    }
  };

  // Bagian: Sign Up
  const signUp = async (email, password, fullName) => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nama_lengkap: fullName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return { success: true };
    } catch (error) {
      return { error };
    }
  };

  // Bagian: Sign Out
  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Bagian: useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
