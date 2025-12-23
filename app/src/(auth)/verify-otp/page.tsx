"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { verifyOtp, loading, error, resendOtp } = useAuth();
  const [cooldown, setCooldown] = useState(0);

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [localError, setLocalError] = useState("");

  const handleResend = async () => {
    if (cooldown > 0) return;

    await resendOtp(email!);
    setCooldown(30);
  };

  // Load email from sessionStorage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("otp_email");
    if (!storedEmail) {
      router.push("/src/register");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!otp || otp.length !== 6) {
      setLocalError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await verifyOtp(email!, otp);
    } catch (err: any) {
      setLocalError(err.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Verify your account
          </h2>
          <p className="text-sm text-gray-600 mt-1">Enter the OTP sent to</p>
          <p className="text-sm font-medium text-gray-800">{email}</p>
        </div>

        {(localError || error) && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").trim())}
              placeholder="Enter 6-digit OTP"
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Didn’t receive OTP?</p>

          <button
            type="button"
            disabled={cooldown > 0 || loading}
            onClick={handleResend}
            className="text-sm font-medium text-purple-600 hover:underline disabled:text-gray-400"
          >
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
