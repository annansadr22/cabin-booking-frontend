// src/contexts/UserAuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/axios"; // Use Axios

interface User {
  id: string;
  username: string;
  email: string;
}

interface UserAuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("nxtwave_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ User Login Function (Backend API)
  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/users/login", {
        email: username,  // Using email/username as input
        password,
      });

      const token = response.data.access_token;
      localStorage.setItem("nxtwave_token", token);

      // Fetch user data (optional)
      const userData = { id: "1", username, email: username };
      setUser(userData);
      localStorage.setItem("nxtwave_user", JSON.stringify(userData));

      toast.success(`Welcome back, ${userData.username}!`);
      navigate("/user/dashboard");
    } catch (error) {
      toast.error("Invalid username or password");
    }
  };

  // ✅ User Registration Function (Backend API)
  const register = async (username: string, email: string, password: string) => {
    try {
      await api.post("/users/register", {
        username,
        email,
        password,
      });

      toast.success("Registration successful! Please login.");
      navigate("/user/login");
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  // ✅ User Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("nxtwave_user");
    localStorage.removeItem("nxtwave_token");
    toast.success("You have been logged out");
    navigate("/user/login");
  };

  return (
    <UserAuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
};
