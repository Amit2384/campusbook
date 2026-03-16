"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, password: newPassword });
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 items-center justify-center -mt-16">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
        
        <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
        </Link>

        {!isSubmitted ? (
          <>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Reset Password</h2>
            <p className="text-gray-600 text-sm mb-6">Enter your email and new password to reset your account.</p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-primary-600 text-white rounded-lg py-2.5 font-medium hover:bg-primary-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Password Reset Complete</h2>
            <p className="text-gray-600 text-sm mb-6">Your password has been successfully reset. You can now login with your new password.</p>
            <Link 
              href="/login"
              className="inline-block w-full bg-primary-600 text-white rounded-lg py-2.5 font-medium hover:bg-primary-700 transition"
            >
              Go to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
