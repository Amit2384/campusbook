"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Buyer"
  });
  const [error, setError] = useState("");
  const { register, login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await register(formData);
    if (res.success) {
      // Auto login after register
      await login(formData.email, formData.password);
      router.push(`/${formData.role.toLowerCase()}/dashboard`);
    } else {
      setError(res.message || "Something went wrong");
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="flex bg-gray-50 items-center justify-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Create an Account</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="Buyer">Buyer (Student looking to buy/rent)</option>
              <option value="Seller">Seller (Student looking to sell)</option>
              {/* Note: Admin creation usually restricted, hidden from public form ideally */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              required
              minLength="6"
              className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
            <input 
              type="tel" 
              name="phone"
              className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-primary-600 text-white rounded-lg py-2 font-medium hover:bg-primary-700 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account? <Link href="/login" className="text-primary-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
