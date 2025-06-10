import React, { createContext, useState, useContext, useEffect } from "react";
import { login as loginService, logoutUser } from "../services/authService";
import {jwtDecode} from "jwt-decode"; 
import { register as registerService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to extract user from access token
  const extractUserFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded; // ✅ Extracted user info (id, role, email, etc.)
    } catch (error) {
      console.error("Invalid access token:", error);
      return null;
    }
  };

//Register Function
const handleRegister = async (name, email, password) => {
  setLoading(true);
  try {
    await registerService(name, email, password);
  } finally {
    setLoading(false);
  }
};

  // Login Function
  const handleLogin = async (email, password, rememberMe) => {
    setLoading(true);
    try {
      const { accessToken } = await loginService(email, password, rememberMe);
      localStorage.setItem("accessToken", accessToken);
      
      const userData = extractUserFromToken(accessToken);
      setUser(userData);
      return user;
    } finally {
      setLoading(false);
    }
  };

  // Logout Function
  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  // Load user from stored access token on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      const userData = extractUserFromToken(storedToken);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
