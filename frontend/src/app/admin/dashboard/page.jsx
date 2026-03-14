"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Users, BookCopy, DollarSign, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalBooksListed: 0, totalRentals: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!user || user.role !== 'Admin') return <div className="p-8 text-center text-red-600">Access Denied</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {loading ? (
        <div className="text-gray-500">Loading metrics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><Users className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-500 font-medium">Total Users</p><h3 className="text-2xl font-bold">{stats.totalUsers}</h3></div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600"><BookCopy className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-500 font-medium">Total Books listed</p><h3 className="text-2xl font-bold">{stats.totalBooksListed}</h3></div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600"><CheckCircle className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-500 font-medium">Total Rentals</p><h3 className="text-2xl font-bold">{stats.totalRentals}</h3></div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg text-green-600"><DollarSign className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-500 font-medium">Revenue Summary</p><h3 className="text-2xl font-bold">${stats.totalRevenue}</h3></div>
          </div>
        </div>
      )}

      {/* Admin Quick Actions */}
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/admin/users" className="block p-6 bg-white border border-gray-100 rounded-xl shadow-sm text-center font-semibold text-gray-700 hover:text-primary-600 hover:border-primary-200 transition">Manage Users</a>
        <a href="/admin/listings" className="block p-6 bg-white border border-gray-100 rounded-xl shadow-sm text-center font-semibold text-gray-700 hover:text-primary-600 hover:border-primary-200 transition">Approve Book Listings</a>
        <a href="/admin/reports" className="block p-6 bg-white border border-gray-100 rounded-xl shadow-sm text-center font-semibold text-gray-700 hover:text-primary-600 hover:border-primary-200 transition">View Detailed Reports</a>
      </div>
    </div>
  );
}
