import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/axios"; // Using Axios for API requests

interface Admin {
  id: string;
  username: string;
  email?: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const navigate = useNavigate();

  // ✅ Check for existing session on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem("nxtwave_admin");
    const storedToken = localStorage.getItem("nxtwave_admin_token");

    if (storedAdmin && storedToken) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
      } catch (error) {
        console.error("Failed to parse stored admin", error);
        clearAdminSession();
      }
    }
  }, []);

  // ✅ Admin Login Function (Backend API with Axios)
  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/users/admin-login", {
        email : username, // Using username for admin login
        password,
      });

      const token = response.data.access_token;
      localStorage.setItem("nxtwave_admin_token", token);

      // Set the token in Axios headers
      api.defaults.headers.Authorization = `Bearer ${token}`;

      // Set admin data
      const adminData = { id: response.data.id, username };
      setAdmin(adminData);
      localStorage.setItem("nxtwave_admin", JSON.stringify(adminData));

      toast.success(`Welcome back, ${adminData.username}!`);
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Invalid admin credentials");
    }
  };

  // ✅ Admin Logout Function
  const logout = () => {
    clearAdminSession();
    toast.success("You have been logged out");
    navigate("/admin/login");
  };

  // ✅ Clear Admin Session Helper
  const clearAdminSession = () => {
    setAdmin(null);
    localStorage.removeItem("nxtwave_admin");
    localStorage.removeItem("nxtwave_admin_token");

    // Clear Axios header
    delete api.defaults.headers.Authorization;
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// ✅ Custom Hook for using AdminAuth Context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
