// src/pages/user/ResetPassword.tsx
import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/axios";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Please fill out both fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    setIsLoading(true);
    try {
      await api.post(`/users/reset-password?token=${token}`, {
        new_password: newPassword,
      });
      toast.success("Password reset successful");
      navigate("/user/login");
    } catch (error) {
      toast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="form-container animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Reset Your Password
          </h2>
          <p className="text-gray-600">
            Enter a new password to continue
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              id="newPassword"
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="nxtwave-btn w-full flex justify-center"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;