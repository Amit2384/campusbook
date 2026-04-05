"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  ShoppingBag, ArrowLeft, RefreshCw, BookOpen,
  User, IndianRupee, Truck, CheckCircle2, Package
} from "lucide-react";

export default function SellerCart() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders/seller");
      // "Cart" = only Pending orders awaiting confirmation
      setPendingOrders(res.data.filter(o => o.status === "Pending"));
    } catch (err) {
      toast.error("Failed to load pending orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "Seller" && user.role !== "Admin") { router.push("/"); return; }
    fetchPending();
  }, [user, authLoading]);

  const handleConfirm = async (orderId) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: "Confirmed" });
      toast.success(`Order #${String(orderId).padStart(5, "0")} confirmed!`);
      setPendingOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm order");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (orderId) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: "Cancelled" });
      toast.success(`Order #${String(orderId).padStart(5, "0")} cancelled`);
      setPendingOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">
      <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" /> Loading...
    </div>
  );

  const totalValue = pendingOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const totalItems = pendingOrders.reduce((sum, o) => sum + (o.items?.length || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link href="/seller/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-5 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-primary-600" /> Fulfillment Queue
            </h1>
            <p className="text-gray-500 text-sm mt-1">Pending orders awaiting your confirmation</p>
          </div>
          <button
            onClick={fetchPending}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" /> Loading pending orders...
        </div>
      ) : pendingOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-200 mx-auto mb-4" />
          <h3 className="text-gray-700 font-bold text-lg mb-1">All caught up!</h3>
          <p className="text-gray-400 text-sm mb-6">No pending orders to fulfill right now.</p>
          <Link href="/seller/orders" className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition">
            <Package className="w-4 h-4" /> View All Orders
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order cards */}
          <div className="lg:col-span-2 space-y-4">
            {pendingOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-yellow-100 shadow-sm overflow-hidden">
                {/* Order Meta */}
                <div className="px-5 py-3 bg-yellow-50 border-b border-yellow-100 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10px] text-yellow-600 font-bold uppercase tracking-wider">Order</p>
                      <p className="text-sm font-bold text-gray-900">#{String(order.id).padStart(5, "0")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-yellow-600 font-bold uppercase tracking-wider">Placed</p>
                      <p className="text-sm text-gray-700">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                      <IndianRupee className="w-3.5 h-3.5" />{Number(order.total_amount).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-yellow-700 font-semibold">
                    <User className="w-3.5 h-3.5" /> {order.buyer_name}
                  </div>
                </div>

                {/* Items */}
                <div className="p-5 space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                        {item.image_url ? (
                          <img src={`http://localhost:5000${item.image_url}`} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.author}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.type === "Purchase" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                          }`}>{item.type}</span>
                          <span className="text-xs font-bold text-gray-800 flex items-center gap-0.5">
                            <IndianRupee className="w-3 h-3" />{Number(item.price_at_purchase).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="flex gap-3 pt-3 border-t border-gray-50 mt-3">
                    <button
                      onClick={() => handleConfirm(order.id)}
                      disabled={updatingId === order.id}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                    >
                      <Truck className="w-4 h-4" />
                      {updatingId === order.id ? "Processing..." : "Confirm & Ship"}
                    </button>
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={updatingId === order.id}
                      className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 text-lg mb-5 border-b pb-4">Queue Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Pending Orders</span>
                  <span className="font-bold text-gray-900">{pendingOrders.length}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Items</span>
                  <span className="font-bold text-gray-900">{totalItems}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-gray-900">
                  <span>Total Value</span>
                  <span className="flex items-center gap-0.5"><IndianRupee className="w-4 h-4" />{totalValue.toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/seller/orders"
                className="w-full flex items-center justify-center gap-2 py-3 border border-primary-200 text-primary-600 rounded-xl text-sm font-semibold hover:bg-primary-50 transition"
              >
                <Package className="w-4 h-4" /> View All Orders
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
