"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import {
  Users, BookCopy, Clock, IndianRupee, BookOpen,
  RefreshCw, CheckCircle, AlertCircle, TrendingUp, Package
} from "lucide-react";

function StatCard({ icon, label, value, color, href }) {
  const inner = (
    <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 ${href ? "cursor-pointer hover:border-primary-200" : ""}`}>
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <h3 className="text-2xl font-black text-gray-900">{value}</h3>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function ActionCard({ href, icon, label, description, badge, badgeColor }) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary-200 transition group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl group-hover:bg-primary-100 transition">
          {icon}
        </div>
        {badge != null && badge > 0 && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
            {badge} pending
          </span>
        )}
      </div>
      <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition">{label}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </Link>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats]           = useState(null);
  const [pendingCount, setPending]  = useState(0);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "Admin") { router.push("/"); return; }
    fetchAll();
  }, [user, authLoading]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/books/pending"),
      ]);
      setStats(statsRes.data);
      setPending(pendingRes.data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
      <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" /> Loading...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Platform overview and management</p>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Pending Alert */}
      {!loading && pendingCount > 0 && (
        <Link href="/admin/listings" className="block mb-8">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3 text-sm text-yellow-800 hover:bg-yellow-100 transition">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-yellow-600" />
            <span>
              <b>{pendingCount} book listing{pendingCount > 1 ? "s" : ""}</b> awaiting your approval — click here to review.
            </span>
          </div>
        </Link>
      )}

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse h-24" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Users"
            value={stats.totalUsers}
            color="bg-blue-100 text-blue-600"
            href="/admin/users"
          />
          <StatCard
            icon={<BookCopy className="w-5 h-5" />}
            label="Books Listed"
            value={stats.totalBooksListed}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Total Rentals"
            value={stats.totalRentals}
            color="bg-orange-100 text-orange-600"
          />
          <StatCard
            icon={<IndianRupee className="w-5 h-5" />}
            label="Revenue (Completed)"
            value={`₹${Number(stats.totalRevenue).toFixed(0)}`}
            color="bg-emerald-100 text-emerald-600"
          />
        </div>
      ) : null}

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ActionCard
          href="/admin/listings"
          icon={<BookOpen className="w-5 h-5" />}
          label="Approve Book Listings"
          description="Review and approve or reject books submitted by sellers."
          badge={pendingCount}
          badgeColor="bg-yellow-50 text-yellow-700 border-yellow-200"
        />
        <ActionCard
          href="/admin/users"
          icon={<Users className="w-5 h-5" />}
          label="Manage Users"
          description="View all registered buyers, sellers and admins on the platform."
        />
        <ActionCard
          href="/admin/orders"
          icon={<Package className="w-5 h-5" />}
          label="All Orders"
          description="Monitor all orders placed across the platform."
        />
      </div>
    </div>
  );
}
