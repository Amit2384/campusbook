"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Search, ShoppingBag, Heart, Clock } from "lucide-react";

export default function BuyerDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, get ready to dive into your next read!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link href="/browse" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4 group">
          <div className="bg-primary-100 p-3 rounded-lg text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition"><Search className="w-6 h-6" /></div>
          <div><h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition">Browse Books</h3><p className="text-xs text-gray-500">Find something new</p></div>
        </Link>
        
        <Link href="/buyer/orders" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4 group">
          <div className="bg-green-100 p-3 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition"><ShoppingBag className="w-6 h-6" /></div>
          <div><h3 className="font-bold text-gray-900 group-hover:text-green-600 transition">My Orders</h3><p className="text-xs text-gray-500">View past purchases</p></div>
        </Link>

        <Link href="/buyer/wishlist" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4 group">
          <div className="bg-red-100 p-3 rounded-lg text-red-600 group-hover:bg-red-600 group-hover:text-white transition"><Heart className="w-6 h-6" /></div>
          <div><h3 className="font-bold text-gray-900 group-hover:text-red-600 transition">Wishlist</h3><p className="text-xs text-gray-500">Saved for later</p></div>
        </Link>

        <Link href="/buyer/rentals" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4 group">
          <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition"><Clock className="w-6 h-6" /></div>
          <div><h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition">Active Rentals</h3><p className="text-xs text-gray-500">Manage returns</p></div>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-10 text-center text-gray-500">
          No recent activity to show. Explore the catalog to get started.
        </div>
      </div>
    </div>
  );
}
