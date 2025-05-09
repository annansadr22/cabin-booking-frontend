
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { toast } from "sonner";

const UserRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, isAuthenticated } = useUserAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/user/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill out all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(username, email, password);
      // Redirect is handled in the register function
    } catch (error) {
      let errorMessage = "Failed to register";
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
            Register to NxtWave
          </h2>
          <p className="text-gray-600">
            Create an account to start booking cabins
          </p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="form-label">
              Username
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
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="new-password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="nxtwave-btn w-full flex justify-center"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/user/login" className="text-nxtwave-primary font-medium hover:underline">
              Sign in
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

export default UserRegister;
