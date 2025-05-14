// src/pages/user/VerifyEmail.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "@/lib/axios";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        await axios.get(`/users/verify-email?token=${token}`);
        setStatus("success");
        toast.success("Email verified! You can now log in.");
      } catch (err) {
        setStatus("error");
        toast.error("Verification failed. Token may be invalid or expired.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {status === "verifying" && <p>Verifying your email...</p>}
        {status === "success" && <p className="text-green-600">✅ Email verified successfully!</p>}
        {status === "error" && <p className="text-red-600">❌ Email verification failed.</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
