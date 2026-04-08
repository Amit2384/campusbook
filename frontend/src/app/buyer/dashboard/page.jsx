"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Package, Heart, Clock } from "lucide-react";

export default function BuyerDashboard() {
  const { user } = useAuth();

  if (!user) return null;

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
               <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1 leading-tight">Placed Order #12345 - "Introduction to Algorithms" - ₹50.00</p>
              <p className="text-xs text-gray-400">Jan 17, 2026</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
               <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1 leading-tight">Added "Design Patterns" to Wishlist</p>
              <p className="text-xs text-gray-400">Jan 14, 2026</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
               <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1 leading-tight">Rental Due: "Artificial Intelligence" in 5 days</p>
              <p className="text-xs text-gray-400">Aug 21, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
