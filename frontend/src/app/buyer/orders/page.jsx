"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ArrowLeft, Clock, Calendar, CheckCircle2, Star, MessageSquare } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewSeller, setReviewSeller] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (sellerId, sellerName) => {
    setReviewSeller({ id: sellerId, name: sellerName });
    setRating(5);
    setComment("");
    setReviewModalOpen(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    const loadingToast = toast.loading("Submitting review...");
    try {
      await api.post("/reviews", {
        seller_id: reviewSeller.id,
        rating: String(rating),
        comment: comment
      });
      toast.success(`You rated ${reviewSeller.name} ${rating} stars!`, { id: loadingToast });
      setReviewModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review", { id: loadingToast });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/buyer/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-4 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-8 w-8 text-primary-600" />
          My Orders
        </h1>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mb-4">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't placed any orders.</p>
          <Link 
            href="/browse"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Order Placed</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="text-sm font-bold text-gray-900">₹{order.total_amount}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 text-right">Order ID</p>
                  <p className="text-sm font-medium text-gray-900">#{order.id.toString().padStart(6, '0')}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-20 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border">
                        {item.image_url ? (
                          <img src={`http://localhost:5000${item.image_url}`} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-gray-900 hover:text-primary-600 transition truncate max-w-md">
                            <Link href={`/book/${item.book_id}`}>{item.title}</Link>
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                            item.type === 'Purchase' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Quantity: {item.quantity}</p>
                        
                        {item.type === 'Rent' && (
                          <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 w-fit px-2 py-1 rounded">
                            <Clock className="w-3 h-3" />
                            Rental due: Soon
                          </div>
                        )}
                        <div className="flex justify-between items-end mt-2">
                          <div className="font-semibold text-gray-900">₹{item.price_at_purchase}</div>
                          {order.status === 'Completed' && (
                            <button
                              onClick={() => openReviewModal(item.seller_id, item.seller_name)}
                              className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
                            >
                              <Star className="w-3.5 h-3.5 fill-gray-400 text-gray-400" /> Rate Seller
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Leave a Review</h3>
                <p className="text-gray-500 text-sm">For Seller: {reviewSeller?.name}</p>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={submitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star className={`w-8 h-8 transition-colors ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments (Optional)</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-primary-500 bg-gray-50 text-gray-900 resize-none"
                    placeholder="How was your experience buying from this seller?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {submittingReview ? "Submitting..." : <>Submit <MessageSquare className="w-4 h-4" /></>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
