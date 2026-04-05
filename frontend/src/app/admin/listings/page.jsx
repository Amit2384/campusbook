"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  BookOpen, CheckCircle, XCircle, Clock, ArrowLeft,
  RefreshCw, User, Tag, IndianRupee, Eye, AlertCircle
} from "lucide-react";

function BookCard({ book, onDecision }) {
  const [loading, setLoading] = useState(false);

  const decide = async (status) => {
    setLoading(true);
    try {
      await api.patch(`/admin/books/${book.id}/status`, { status });
      toast.success(
        status === "Live"
          ? `✅ "${book.title}" approved & is now Live!`
          : `❌ "${book.title}" has been rejected.`
      );
      onDecision(book.id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex gap-0">
        {/* Book Cover */}
        <div className="w-28 flex-shrink-0 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
          {book.image_url ? (
            <img
              src={`http://localhost:5000${book.image_url}`}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="w-10 h-10 text-primary-300" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{book.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">by {book.author}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  <Tag className="w-3 h-3" /> {book.category_name}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                  book.condition_state === "New" ? "bg-emerald-50 text-emerald-700" :
                  book.condition_state === "Good" ? "bg-blue-50 text-blue-700" :
                  "bg-orange-50 text-orange-700"
                }`}>
                  {book.condition_state}
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full">
                  <User className="w-3 h-3" /> {book.seller_name}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-3 text-sm">
                {book.price && (
                  <span className="flex items-center gap-0.5 font-bold text-gray-800">
                    <IndianRupee className="w-3.5 h-3.5" />{book.price}
                    <span className="ml-1 text-xs text-gray-400 font-normal">sale</span>
                  </span>
                )}
                {book.rental_price_per_day && (
                  <span className="flex items-center gap-0.5 font-bold text-gray-800">
                    <IndianRupee className="w-3.5 h-3.5" />{book.rental_price_per_day}
                    <span className="ml-1 text-xs text-gray-400 font-normal">/day</span>
                  </span>
                )}
                <span className="text-gray-400 text-xs">Qty: {book.available_quantity}</span>
              </div>

              {book.description && (
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{book.description}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => decide("Live")}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 whitespace-nowrap"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => decide("Rejected")}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-xl hover:bg-red-100 transition disabled:opacity-50 whitespace-nowrap"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <Link
                href={`/book/${book.id}`}
                target="_blank"
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-100 transition text-center justify-center"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 bg-yellow-50 border-t border-yellow-100 flex items-center gap-2 text-xs text-yellow-700">
        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
        Submitted {new Date(book.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}

export default function AdminListings() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [books, setBooks]     = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/books/pending");
      setBooks(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load pending books");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "Admin") { router.push("/"); return; }
    fetchPending();
  }, [user, authLoading]);

  const handleDecision = (bookId) => {
    setBooks(prev => prev.filter(b => b.id !== bookId));
  };

  if (authLoading) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center text-gray-400">
      <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" /> Loading...
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-5 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Admin Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Book Approval Queue
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Review and approve or reject book listings submitted by sellers
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!loading && (
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
                books.length > 0
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}>
                {books.length} pending
              </span>
            )}
            <button
              onClick={fetchPending}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm h-36 animate-pulse" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <CheckCircle className="w-14 h-14 text-emerald-200 mx-auto mb-4" />
          <h3 className="text-gray-700 font-bold text-lg mb-1">All clear!</h3>
          <p className="text-gray-400 text-sm">No book listings are pending approval right now.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-2 text-sm text-yellow-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span><b>{books.length} book{books.length > 1 ? "s" : ""}</b> waiting for your review. Approved books become visible to buyers immediately.</span>
          </div>
          <div className="space-y-4">
            {books.map(book => (
              <BookCard key={book.id} book={book} onDecision={handleDecision} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
