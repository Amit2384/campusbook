"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Calendar, ArrowLeft, Book, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const res = await api.get("/rentals");
      setRentals(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load rentals");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (rentalId) => {
    const loadingToast = toast.loading("Processing return...");
    try {
      // For demo purposes, we're not calculating late fines yet
      await api.patch(`/rentals/${rentalId}/return`, { late_fine: 0 });
      toast.success("Book returned successfully!", { id: loadingToast });
      fetchRentals(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to return book", { id: loadingToast });
    }
  };

  const isOverdue = (endDate) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/buyer/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-4 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              My Rentals
            </h1>
            <p className="text-gray-600 mt-1">Manage your active and past book borrowings.</p>
          </div>
          <button 
            onClick={fetchRentals} 
            className="p-2 text-gray-400 hover:text-primary-600 transition"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">
           <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mb-4"></div>
           <p>Loading your rentals...</p>
        </div>
      ) : rentals.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
          <div className="mx-auto bg-yellow-50 h-24 w-24 rounded-full flex items-center justify-center mb-6">
            <Book className="h-10 w-10 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No rentals found</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Borrowing books is a great way to save money and read more. Browse our collection to find your next book!</p>
          <Link 
            href="/browse"
            className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-100 transition"
          >
            Start Browsing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rentals.map((rental) => {
            const overdue = rental.status === 'Active' && isOverdue(rental.rental_end_date);
            
            return (
              <div key={rental.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex transition-all ${rental.status === 'Returned' ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-md'}`}>
                <div className="w-1/3 bg-gray-50 overflow-hidden">
                  {rental.image_url ? (
                    <img src={`http://localhost:5000${rental.image_url}`} alt={rental.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <Book className="w-8 h-8 text-gray-300 mb-2" />
                      <span className="text-[10px] text-gray-400 uppercase font-bold text-center">No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="w-2/3 p-5 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      rental.status === 'Active' ? (overdue ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700') : 'bg-gray-100 text-gray-600'
                    }`}>
                      {overdue ? 'Overdue' : rental.status}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400">ID: #{rental.id.toString().padStart(4, '0')}</span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{rental.title}</h3>
                  
                  <div className="space-y-2 mt-2 flex-grow">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(rental.rental_start_date).toLocaleDateString()} — {new Date(rental.rental_end_date).toLocaleDateString()}</span>
                    </div>
                    
                    {rental.status === 'Active' && (
                      <div className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-lg ${overdue ? 'text-red-600 bg-red-50' : 'text-primary-600 bg-primary-50'}`}>
                        {overdue ? (
                           <> <AlertCircle className="w-3.5 h-3.5" /> Overdue! Please return ASAP </>
                        ) : (
                           <> <Clock className="w-3.5 h-3.5" /> Return by {new Date(rental.rental_end_date).toLocaleDateString()} </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <div className="text-sm font-bold text-gray-900">${rental.rental_price_per_day}<span className="text-[10px] font-medium text-gray-400">/day</span></div>
                    
                    {rental.status === 'Active' ? (
                      <button 
                        onClick={() => handleReturn(rental.id)}
                        className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                      >
                        Return Book
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                        <CheckCircle className="w-4 h-4" /> Returned
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
