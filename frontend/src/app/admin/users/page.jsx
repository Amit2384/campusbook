"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Users, ArrowLeft, RefreshCw, Mail, Phone, Clock, Trash2 } from "lucide-react";

export default function AdminUsers() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUserRecord = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? All their data (listings, orders) will be lost.")) return;
    const loadingToast = toast.loading("Deleting user...");
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully", { id: loadingToast });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user", { id: loadingToast });
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "Admin") { router.push("/"); return; }
    fetchUsers();
  }, [user, authLoading]);

  if (authLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
      <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" /> Loading...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-5 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Users className="w-8 h-8 text-primary-600" /> Manage Users
            </h1>
            <p className="text-gray-500 text-sm mt-1">View and manage all registered accounts across the platform.</p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" /> Loading users...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Joined On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{u.name}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">ID: {u.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        u.role === "Admin" ? "bg-red-50 text-red-700 border-red-200" :
                        u.role === "Seller" ? "bg-purple-50 text-purple-700 border-purple-200" :
                        "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="w-3.5 h-3.5 text-gray-400" /> {u.email}
                      </div>
                      {u.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                          <Phone className="w-3.5 h-3.5 text-gray-400" /> {u.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.id !== u.id && (
                        <button 
                          onClick={() => deleteUserRecord(u.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
