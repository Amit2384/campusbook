"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { LogOut, BookOpen, ShoppingCart, Heart, User, LayoutDashboard, Clock, Package, ShoppingBag, BookCheck } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [pendingBooksCount, setPendingBooksCount]   = useState(0);

  useEffect(() => {
    if (!user) return;
    // Seller: pending incoming orders
    if (user.role === "Seller") {
      api.get("/orders/seller")
        .then(res => setPendingOrdersCount(res.data.filter(o => o.status === "Pending").length))
        .catch(() => {});
    }
    // Admin: pending book approvals
    if (user.role === "Admin") {
      api.get("/admin/books/pending")
        .then(res => setPendingBooksCount(res.data.length))
        .catch(() => {});
    }
  }, [user]);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <span className="font-bold text-xl tracking-tight text-gray-900">CampusBook</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/browse" className="text-gray-600 hover:text-primary-600 font-medium">Browse</Link>

            {user ? (
              <>
                {user.role === 'Buyer' && (
                  <>
                    <Link href="/buyer/wishlist" className="text-gray-600 hover:text-primary-600" title="Wishlist"><Heart className="h-5 w-5" /></Link>
                    <Link href="/buyer/rentals" className="text-gray-600 hover:text-primary-600" title="Rentals"><Clock className="h-5 w-5" /></Link>
                    <Link href="/buyer/cart" className="text-gray-600 hover:text-primary-600" title="Cart"><ShoppingCart className="h-5 w-5" /></Link>
                    <Link href="/buyer/profile" className="text-gray-600 hover:text-primary-600" title="Profile">
                      {user.profile_image ? (
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                          <img src={`http://localhost:5000${user.profile_image}`} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Link>
                  </>
                )}
                
                {user.role === 'Seller' && (
                  <>
                    <Link href="/seller/orders" className="text-gray-600 hover:text-primary-600" title="Incoming Orders">
                      <Package className="h-5 w-5" />
                    </Link>
                    <Link href="/seller/cart" className="relative text-gray-600 hover:text-primary-600" title="Fulfillment Queue">
                      <ShoppingBag className="h-5 w-5" />
                      {pendingOrdersCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                          {pendingOrdersCount > 9 ? "9+" : pendingOrdersCount}
                        </span>
                      )}
                    </Link>
                    <Link href="/seller/profile" className="text-gray-600 hover:text-primary-600" title="Profile">
                      {user.profile_image ? (
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                          <img src={`http://localhost:5000${user.profile_image}`} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Link>
                  </>
                )}

                {user.role === 'Admin' && (
                  <>
                    <Link href="/admin/listings" className="relative text-gray-600 hover:text-primary-600" title="Approve Book Listings">
                      <BookCheck className="h-5 w-5" />
                      {pendingBooksCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                          {pendingBooksCount > 9 ? "9+" : pendingBooksCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                
                <Link 
                  href={`/${user.role.toLowerCase()}/dashboard`} 
                  className="flex items-center gap-1 text-gray-600 hover:text-primary-600 font-medium"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <button 
                  onClick={logout} 
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-primary-600 font-medium">Login</Link>
                <Link href="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
