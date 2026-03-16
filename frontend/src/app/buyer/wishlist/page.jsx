"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, Trash2, ShoppingCart } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      setItems(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      await api.delete(`/wishlist/${bookId}`);
      setItems(items.filter(item => item.id !== bookId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/browse" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-4 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Browse Books
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="h-8 w-8 text-primary-600 fill-primary-600" />
          My Wishlist
        </h1>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading wishlist...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you're interested in for later.</p>
          <Link 
            href="/browse"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Find Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((book) => (
            <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col group relative">
              <button 
                onClick={() => removeFromWishlist(book.id)}
                className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <Link href={`/book/${book.id}`} className="block overflow-hidden h-48 bg-gray-50">
                {book.image_url ? (
                  <img src={`http://localhost:5000${book.image_url}`} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </Link>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{book.author}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="font-bold text-primary-600">
                    ${book.price || book.rental_price_per_day}
                  </div>
                  <Link href={`/book/${book.id}`} className="text-xs font-semibold text-gray-600 hover:text-primary-600">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
