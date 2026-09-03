"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen, Package, Star, TrendingUp, Plus, RefreshCw,
  Tag, Clock, CheckCircle, XCircle, AlertCircle, IndianRupee, ShoppingBag, Trash2, EyeOff
} from "lucide-react";

const STATUS_CONFIG = {
  Live:     { label: "Live",     color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  Pending:  { label: "Pending",  color: "bg-yellow-100  text-yellow-700  border-yellow-200"  },
  Rejected: { label: "Rejected", color: "bg-red-100     text-red-700     border-red-200"     },
  Removed:  { label: "Removed",  color: "bg-gray-100    text-gray-500    border-gray-200"    },
};

const StatusIcon = ({ status }) => {
  if (status === "Live")     return <CheckCircle  className="w-3 h-3" />;
  if (status === "Pending")  return <Clock        className="w-3 h-3" />;
  if (status === "Rejected") return <XCircle      className="w-3 h-3" />;
  return                            <AlertCircle  className="w-3 h-3" />;
};

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        {sub && <span className="text-xs text-gray-400 font-medium">{sub}</span>}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-black text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats]       = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, listingsRes] = await Promise.all([
        api.get("/books/seller/stats"),
        api.get("/books/seller/listings"),
      ]);
      setStats(statsRes.data);
      setListings(listingsRes.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Unknown error";
      console.error("Dashboard fetch error:", err);
      setError(`Failed to load dashboard data: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.delete(`/books/${deleteTarget.id}`);
      setListings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteSuccess(`"${deleteTarget.title}" has been removed from your listings.`);
      setTimeout(() => setDeleteSuccess(null), 4000);
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete listing.");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const confirmRemove = async (book) => {
    const target = book || deleteTarget;
    if (!target) return;
    setRemoveLoading(true);
    setDeleteError(null);
    try {
      await api.patch(`/books/${target.id}/remove`);
      setListings((prev) =>
        prev.map((b) => b.id === target.id ? { ...b, status: "Removed", available_quantity: 0 } : b)
      );
      setDeleteTarget(null);
      setDeleteSuccess(`"${target.title}" has been unlisted and is no longer visible to buyers.`);
      setTimeout(() => setDeleteSuccess(null), 4000);
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to remove listing.");
    } finally {
      setRemoveLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth context to finish resolving before calling the API
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "Seller" && user.role !== "Admin") {
      router.push("/");
      return;
    }

    fetchData();
  }, [user, authLoading]);

  // Show a spinner while auth context is still loading
  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Seller Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your books and track your performance</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/seller/orders"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <Package className="w-4 h-4" />
            Orders
          </Link>
          <Link
            href="/seller/cart"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            Queue
          </Link>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/seller/add-book"
            className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition shadow-sm shadow-primary-200"
          >
            <Plus className="w-4 h-4" />
            Add New Book
          </Link>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          {error}
          <button onClick={fetchData} className="ml-auto text-red-600 font-semibold hover:underline">Retry</button>
        </div>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
              <div className="w-10 h-10 bg-gray-100 rounded-xl mb-4" />
              <div className="h-7 w-16 bg-gray-100 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            label="Books Listed"
            value={stats.totalListed}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            icon={<Package className="w-5 h-5" />}
            label="Books Sold"
            value={stats.booksSold}
            color="bg-emerald-100 text-emerald-600"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Books Rented"
            value={stats.booksRented}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            icon={<Star className="w-5 h-5" />}
            label="Avg. Rating"
            value={stats.avgRating ? `${stats.avgRating} ★` : "N/A"}
            color="bg-yellow-100 text-yellow-600"
            sub={stats.avgRating ? "out of 5" : "No reviews yet"}
          />
        </div>
      ) : null}

      {/* Revenue Banner */}
      {stats && (
        <div className="mb-10 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 flex items-center justify-between text-white shadow-md shadow-primary-200">
          <div>
            <p className="text-primary-200 text-sm font-medium uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-4xl font-black flex items-center gap-1">
              <IndianRupee className="w-7 h-7" />{stats.totalRevenue}
            </p>
          </div>
          <TrendingUp className="w-16 h-16 text-white/20" />
        </div>
      )}

      {/* Listings Table */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Listings</h2>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400">
            <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" />
            Loading your listings...
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-gray-600 font-semibold mb-1">No books listed yet</h3>
            <p className="text-gray-400 text-sm mb-6">Start selling by listing your first book.</p>
            <Link
              href="/seller/add-book"
              className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition"
            >
              <Plus className="w-4 h-4" /> List Your First Book
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 text-left">Book</th>
                    <th className="px-6 py-4 text-left">Category</th>
                    <th className="px-6 py-4 text-left">Condition</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Qty</th>
                    <th className="px-6 py-4 text-left">Sold</th>
                    <th className="px-6 py-4 text-left">Rented</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {listings.map((book) => {
                    const cfg = STATUS_CONFIG[book.status] || STATUS_CONFIG.Removed;
                    return (
                      <tr key={book.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {book.image_url ? (
                              <img
                                src={`http://localhost:5000${book.image_url}`}
                                alt={book.title}
                                className="w-10 h-13 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-13 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-primary-100">
                                <BookOpen className="w-5 h-5 text-primary-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900 leading-tight line-clamp-1">{book.title}</p>
                              <p className="text-gray-400 text-xs mt-0.5">{book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                            <Tag className="w-3 h-3" /> {book.category_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{book.condition_state}</td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            {book.price && (
                              <p className="text-gray-800 font-semibold">₹{book.price}</p>
                            )}
                            {book.rental_price_per_day && (
                              <p className="text-gray-400 text-xs">₹{book.rental_price_per_day}/day</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 font-medium">{book.available_quantity}</td>
                        <td className="px-6 py-4 text-emerald-600 font-semibold">{book.total_sold}</td>
                        <td className="px-6 py-4 text-purple-600 font-semibold">{book.total_rented}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                            <StatusIcon status={book.status} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {book.status !== "Removed" && (
                              <button
                                onClick={() => confirmRemove(book)}
                                disabled={removeLoading}
                                title="Remove listing (hide from buyers)"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors disabled:opacity-50"
                              >
                                <EyeOff className="w-3.5 h-3.5" />
                                Remove
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteTarget(book)}
                              title="Permanently delete listing"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Success Toast */}
      {deleteSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-emerald-200 text-sm font-medium">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          {deleteSuccess}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-5">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Delete Listing?</h3>
            <p className="text-sm text-gray-500 text-center mb-1">
              Are you sure you want to permanently remove
            </p>
            <p className="text-sm font-semibold text-gray-800 text-center mb-5 line-clamp-2">&ldquo;{deleteTarget.title}&rdquo;?</p>

            {deleteError && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 text-xs">
                <p className="font-semibold mb-2">{deleteError}</p>
                <button
                  onClick={() => confirmRemove(deleteTarget)}
                  disabled={removeLoading}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-orange-100 hover:bg-orange-200 border border-orange-300 text-orange-800 font-semibold text-xs transition disabled:opacity-50"
                >
                  {removeLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {removeLoading ? "Removing…" : "Remove Listing Instead"}
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteTarget(null); setDeleteError(null); }}
                disabled={deleteLoading || removeLoading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading || removeLoading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleteLoading ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
