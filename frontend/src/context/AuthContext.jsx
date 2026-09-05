import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("adminToken") || null,
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("adminUser");
    if (!savedUser || savedUser === "undefined") return null;
    try {
      return JSON.parse(savedUser);
    } catch (e) {
      return null;
    }
  });

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("adminToken", newToken);
    localStorage.setItem("adminUser", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
