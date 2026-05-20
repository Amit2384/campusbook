"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Heart, Clock, Activity } from "lucide-react";
import api from "@/lib/api";

// Format a date string into a readable label (e.g. "May 16, 2026")
function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Returns days remaining until a date (negative = overdue)
function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Skeleton loader card
function SkeletonCard() {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3.5 bg-gray-100 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-2/5" />
      </div>
    </div>
  );
}

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [activity, setActivity] = useState({ order: null, wishlist: null, rental: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchActivity = async () => {
      try {
        const [ordersRes, wishlistRes, rentalsRes] = await Promise.allSettled([
          api.get("/orders"),
          api.get("/wishlist"),
          api.get("/rentals"),
        ]);

        // Most recent order
        const orders = ordersRes.status === "fulfilled" ? ordersRes.value.data : [];
        const latestOrder = orders[0] ?? null;

        // Most recent wishlist item
        const wishlist = wishlistRes.status === "fulfilled" ? wishlistRes.value.data : [];
        const latestWishlist = wishlist[0] ?? null;

        // Most recent active rental (status !== 'Returned'), sorted by end date proximity
        const rentals = rentalsRes.status === "fulfilled" ? rentalsRes.value.data : [];
        const activeRentals = rentals.filter((r) => r.status !== "Returned");
        const latestRental =
          activeRentals.sort(
            (a, b) => new Date(a.rental_end_date) - new Date(b.rental_end_date)
          )[0] ?? null;

        setActivity({ order: latestOrder, wishlist: latestWishlist, rental: latestRental });
      } catch (err) {
        console.error("Failed to fetch recent activity", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [user]);

  if (!user) return null;

  const { order, wishlist, rental } = activity;
  const hasAnyActivity = order || wishlist || rental;

  // Build the order label
  const orderTitle = order?.items?.[0]?.title
    ? `"${order.items[0].title}"${order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}`
    : null;
  const orderLabel = order
    ? `Placed Order #${String(order.id).padStart(5, "0")}${orderTitle ? ` — ${orderTitle}` : ""} — ₹${order.total_amount}`
    : null;

  // Rental due label
  const rentalDays = rental ? daysUntil(rental.rental_end_date) : null;
  const rentalLabel = rental
    ? rentalDays < 0
      ? `Rental Overdue: "${rental.title}" by ${Math.abs(rentalDays)} day${Math.abs(rentalDays) !== 1 ? "s" : ""}`
      : rentalDays === 0
      ? `Rental Due Today: "${rental.title}"`
      : `Rental Due: "${rental.title}" in ${rentalDays} day${rentalDays !== 1 ? "s" : ""}`
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Hero Banner Area */}
      <div className="relative mb-8 rounded-[2.5rem] shadow-xl">
        {/* Background Container with overflow hidden for decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-[2.5rem] overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        </div>
        
        {/* Content (No overflow hidden) */}
        <div className="relative p-10 pb-24 md:p-16 md:pb-28">
          <div className="flex justify-between items-center relative z-10">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                Welcome back, {user?.name?.split(' ')[0] || 'there'}!
              </h1>
              <p className="text-blue-100 text-lg md:text-xl font-medium">Ready to dive into your next great read?</p>
            </div>
            <div className="hidden md:block w-72 h-64 relative -mt-10">
              <img 
                src="/assets/3d-bannerr.png" 
                alt="Floating 3D Book" 
                className="absolute inset-0 w-full h-full object-contain transform scale-125 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Floating Quick Links - Overlaps the bottom edge cleanly */}
        <div className="absolute -bottom-12 md:-bottom-16 left-0 right-0 px-6 md:px-10 z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Link href="/browse" className="bg-white/95 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition flex xl:flex-row flex-col justify-center items-center xl:items-start gap-4 group border border-white">
              <img src="/assets/3d-browse.png" alt="Browse" className="w-14 h-14 md:w-20 md:h-20 object-contain group-hover:scale-110 transition" />
              <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition flex-1 text-center xl:text-left text-base md:text-lg leading-tight mt-2 xl:mt-0">Browse<br className="hidden xl:block"/>Books</h3>
            </Link>
            
            <Link href="/buyer/orders" className="bg-white/95 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition flex xl:flex-row flex-col justify-center items-center xl:items-start gap-4 group border border-white">
              <img src="/assets/3d-bag.png" alt="Orders" className="w-14 h-14 md:w-20 md:h-20 object-contain group-hover:scale-110 transition" />
              <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition flex-1 text-center xl:text-left text-base md:text-lg leading-tight mt-2 xl:mt-0">My<br className="hidden xl:block"/>Orders</h3>
            </Link>

            <Link href="/buyer/wishlist" className="bg-white/95 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition flex xl:flex-row flex-col justify-center items-center xl:items-start gap-4 group border border-white">
              <img src="/assets/3d-heart.png" alt="Wishlist" className="w-14 h-14 md:w-20 md:h-20 object-contain group-hover:scale-110 transition" />
              <h3 className="font-bold text-gray-900 group-hover:text-red-500 transition flex-1 text-center xl:text-left text-base md:text-lg leading-tight mt-2 xl:mt-0">Saved<br className="hidden xl:block"/>Wishlist</h3>
            </Link>

            <Link href="/buyer/rentals" className="bg-white/95 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition flex xl:flex-row flex-col justify-center items-center xl:items-start gap-4 group border border-white">
              <img src="/assets/3d-clock.png" alt="Rentals" className="w-14 h-14 md:w-20 md:h-20 object-contain group-hover:scale-110 transition -rotate-12" />
              <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition flex-1 text-center xl:text-left text-base md:text-lg leading-tight mt-2 xl:mt-0">Active<br className="hidden xl:block"/>Rentals</h3>
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer to accommodate overlapping cards */}
      <div className="h-24"></div>

      {/* Recent Activity Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : !hasAnyActivity ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <Activity className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">No recent activity yet. Start by browsing books!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Latest Order */}
            {order ? (
              <Link href="/buyer/orders" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition group">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm mb-1 leading-snug group-hover:text-green-700 transition line-clamp-2">
                    {orderLabel}
                  </p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter mb-1 ${
                    order.status === "Completed" ? "bg-green-100 text-green-700" :
                    order.status === "Cancelled" ? "bg-red-100 text-red-600" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {order.status ?? "Pending"}
                  </span>
                  <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                </div>
              </Link>
            ) : (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-dashed border-gray-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">No orders placed yet.</p>
                </div>
              </div>
            )}

            {/* Latest Wishlist Item */}
            {wishlist ? (
              <Link href="/buyer/wishlist" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition group">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm mb-1 leading-snug group-hover:text-red-600 transition line-clamp-2">
                    Added &ldquo;{wishlist.title}&rdquo; to Wishlist
                  </p>
                  <p className="text-xs text-gray-400">{wishlist.author && <span className="text-gray-500">{wishlist.author} · </span>}{formatDate(wishlist.created_at)}</p>
                </div>
              </Link>
            ) : (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-dashed border-gray-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-red-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Your wishlist is empty.</p>
                </div>
              </div>
            )}

            {/* Active Rental */}
            {rental ? (
              <Link href="/buyer/rentals" className={`bg-white p-5 rounded-2xl shadow-sm border flex items-start gap-4 hover:shadow-md transition group ${rentalDays !== null && rentalDays <= 2 ? "border-orange-200 bg-orange-50/30" : "border-gray-100"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${rentalDays !== null && rentalDays <= 2 ? "bg-orange-100" : "bg-yellow-50"}`}>
                  <Clock className={`w-5 h-5 ${rentalDays !== null && rentalDays <= 2 ? "text-orange-500" : "text-yellow-600"}`} />
                </div>
                <div className="min-w-0">
                  <p className={`font-semibold text-sm mb-1 leading-snug line-clamp-2 transition ${rentalDays !== null && rentalDays <= 2 ? "text-orange-700 group-hover:text-orange-600" : "text-gray-900 group-hover:text-yellow-700"}`}>
                    {rentalLabel}
                  </p>
                  <p className="text-xs text-gray-400">Due: {formatDate(rental.rental_end_date)}</p>
                </div>
              </Link>
            ) : (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-dashed border-gray-200 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">No active rentals.</p>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
