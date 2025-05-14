// src/pages/user/ForgotPassword.tsx
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/users/forgot-password", { email });
      toast.success("Check your inbox for the reset link");
    } catch (error) {
      toast.error("Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="form-container animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-600">
            Enter your email to receive a reset link
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="nxtwave-btn w-full flex justify-center"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link to="/user/login" className="text-sm text-gray-500 hover:text-nxtwave-primary">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;