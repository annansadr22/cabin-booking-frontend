
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { toast } from "sonner";

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useUserAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/user/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(username, password);
      // Redirect is handled in the login function
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
            Welcome to NxtWave
          </h2>
          <p className="text-gray-600">
            Sign in to access your cabin bookings
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
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/user/register" className="text-nxtwave-primary font-medium hover:underline">
              Register here
            </Link>
          </p>
          
          <div className="mt-4">
            <Link to="/" className="text-sm text-gray-500 hover:text-nxtwave-primary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
