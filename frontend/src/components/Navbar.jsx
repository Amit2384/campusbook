"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { LogOut, BookOpen, ShoppingCart, Heart, User, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
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
                    <Link href="/buyer/wishlist" className="text-gray-600 hover:text-primary-600"><Heart className="h-5 w-5" /></Link>
                    <Link href="/buyer/cart" className="text-gray-600 hover:text-primary-600"><ShoppingCart className="h-5 w-5" /></Link>
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
