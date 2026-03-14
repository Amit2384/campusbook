"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(email, password);
    if (res.success) {
      router.push(`/${res.role.toLowerCase()}/dashboard`);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 items-center justify-center -mt-16">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Welcome Back</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary-600 text-white rounded-lg py-2 font-medium hover:bg-primary-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Don't have an account? <Link href="/register" className="text-primary-600 font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
