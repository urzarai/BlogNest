import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // checking session on mount

  // On app load, try to restore session from cookie
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/my-profile",
          { withCredentials: true }
        );
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const login = async (email, password, role) => {
    const { data } = await axios.post(
      "http://localhost:5000/api/users/login",
      { email, password, role },
      { withCredentials: true }
    );
    // Fetch full profile (includes photo etc.)
    const profile = await axios.get(
      "http://localhost:5000/api/users/my-profile",
      { withCredentials: true }
    );
    setUser(profile.data.user);
    return data;
  };

  const logout = async () => {
    await axios.get("http://localhost:5000/api/users/logout", {
      withCredentials: true,
    });
    setUser(null);
  };

  const register = async (formData) => {
    const { data } = await axios.post(
      "http://localhost:5000/api/users/register",
      formData,
      { withCredentials: true }
    );
    const profile = await axios.get(
      "http://localhost:5000/api/users/my-profile",
      { withCredentials: true }
    );
    setUser(profile.data.user);
    return data;
  };

  const isAdmin = user?.role === "Admin";
  const isUser = user?.role === "User";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, isAdmin, isUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};