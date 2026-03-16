"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, cartTotal } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/browse" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-4 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="h-8 w-8 text-primary-600" />
          Your Cart
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any books to your cart yet.</p>
          <Link 
            href="/browse"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
             {cart.map((book) => (
               <div key={book.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-20 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border">
                    {book.image_url ? (
                      <img src={`http://localhost:5000${book.image_url}`} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 truncate max-w-sm">
                      <Link href={`/book/${book.id}`}>{book.title}</Link>
                    </h4>
                    <p className="text-sm text-gray-500">{book.author}</p>
                    <div className="mt-2 font-bold text-primary-600">${book.price}</div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(book.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5"/>
                  </button>
               </div>
             ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => toast.error("Checkout feature coming soon!")}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
