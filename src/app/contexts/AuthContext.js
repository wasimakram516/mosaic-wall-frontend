"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import {
  login as loginService,
  logoutUser,
  register as registerService,
} from "../../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register Function
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
      const { accessToken, user } = await loginService(
        email,
        password,
        rememberMe
      );

      // Store token & user info
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  // Logout Function
  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
