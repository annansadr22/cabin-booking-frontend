import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/axios";

interface User {
  id: string;
  username: string;
  email: string;
}

interface UserAuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    employeeId: string
  ) => Promise<void>;
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

  // ✅ User Login Function
  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/users/login", {
        email: username,
        password,
      });

      const token = response.data.access_token;
      localStorage.setItem("nxtwave_token", token);

      const userData = {
          id: "1", // or remove if not used
          username: response.data.username,
          email: response.data.email,
        };
      setUser(userData);
      localStorage.setItem("nxtwave_user", JSON.stringify(userData));

      toast.success(`Welcome back, ${userData.username}!`);
      navigate("/user/dashboard");
    } catch (error) {
      toast.error("Invalid username or password");
    }
  };

  // ✅ Updated Registration Function with employee_id
  const register = async (
    username: string,
    email: string,
    password: string,
    employeeId: string
  ) => {
    try {
      await api.post("/users/register", {
        username,
        email,
        password,
        employee_id: employeeId, // ✅ included
      });

      toast.success("Registration successful! Please check your email to verify.");
      navigate("/user/login");
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  // ✅ User Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("nxtwave_user");
    localStorage.removeItem("nxtwave_token");
    toast.success("You have been logged out");
    navigate("/user/login");
  };

  return (
    <UserAuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated: !!user }}
    >
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
