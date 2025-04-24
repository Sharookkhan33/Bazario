import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token, type) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userType", type);
    setIsLoggedIn(true);
    setUserType(type);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    setUserType(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("userType");

    const validateToken = async () => {
      if (token) {
        try {
          // Replace this URL with your actual token validation endpoint
          const res = await fetch("/api/auth/validate", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            setIsLoggedIn(true);
            setUserType(type);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    validateToken();

    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const type = localStorage.getItem("userType");
      setIsLoggedIn(!!token);
      setUserType(type || null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner component
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

