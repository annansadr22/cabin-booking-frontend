// src/pages/admin/AdminLogin.tsx
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { toast } from "sonner";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAdminAuth();

  // ✅ Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ Basic validation
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(username, password);
      // ✅ Redirect is handled in the login function within the context
    } catch (error) {
      let errorMessage = "Failed to login";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="form-container animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome to NxtWave Admin Dashboard
          </h2>
          <p className="text-gray-600">
            Sign in to manage cabins and bookings
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="form-label">
              Username or Email
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="nxtwave-btn w-full flex justify-center"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <div className="mt-4">
            <Link to="/" className="text-sm text-gray-500 hover:text-nxtwave-primary">
              ← Back to Home
            </Link>
          </div>
          
          <div className="mt-4 pt-4 border-t text-xs text-gray-500">
            <p>For demo: Use "admin" as username and "admin123" as password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
