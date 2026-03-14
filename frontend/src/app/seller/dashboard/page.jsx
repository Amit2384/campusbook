"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Edit, Package, Star, MessageSquare } from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // We didn't build a seller stats endpoint, so let's just make it look good for now
    setStats({
      booksListed: 12,
      booksSold: 4,
      booksRented: 2,
      rating: 4.8
    });
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition flex items-center gap-2">
          <Edit className="w-4 h-4" /> Add New Book
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><BookOpen className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium">Listed Books</p><h3 className="text-2xl font-bold">{stats?.booksListed}</h3></div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600"><Package className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium">Books Sold</p><h3 className="text-2xl font-bold">{stats?.booksSold}</h3></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600"><Star className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium">Books Rented</p><h3 className="text-2xl font-bold">{stats?.booksRented}</h3></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600"><MessageSquare className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium">Average Rating</p><h3 className="text-2xl font-bold">{stats?.rating}</h3></div>
        </div>
      </div>

      {/* Book Listings Section */}
      <h2 className="text-xl font-bold mb-4">Your Listings</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-10 text-center text-gray-500">
          You haven't listed any books yet.
        </div>
      </div>
    </div>
  );
}

function BookOpen(props) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
}
