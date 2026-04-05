"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Package, ArrowLeft, RefreshCw, BookOpen, User,
  CheckCircle, Clock, XCircle, Truck, IndianRupee,
  Mail, Phone, ChevronDown
} from "lucide-react";

const STATUS_STYLES = {
  Pending:   { color: "bg-yellow-100 text-yellow-700 border-yellow-200",  icon: <Clock      className="w-3.5 h-3.5" /> },
  Confirmed: { color: "bg-blue-100   text-blue-700   border-blue-200",    icon: <Truck      className="w-3.5 h-3.5" /> },
  Completed: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  Cancelled: { color: "bg-red-100    text-red-700    border-red-200",     icon: <XCircle    className="w-3.5 h-3.5" /> },
};

const NEXT_ACTIONS = {
  Pending:   [{ label: "Confirm Order",  status: "Confirmed", cls: "bg-blue-600 hover:bg-blue-700 text-white" },
              { label: "Cancel Order",   status: "Cancelled", cls: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200" }],
  Confirmed: [{ label: "Mark Completed", status: "Completed", cls: "bg-emerald-600 hover:bg-emerald-700 text-white" },
              { label: "Cancel Order",   status: "Cancelled", cls: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200" }],
  Completed: [],
  Cancelled: [],
};

function OrderCard({ order, onStatusChange }) {
  const [updating, setUpdating] = useState(false);
  const st = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
  const actions = NEXT_ACTIONS[order.status] || [];

  const handleAction = async (newStatus) => {
    setUpdating(true);
    try {
      await api.patch(`/orders/${order.id}/status`, { status: newStatus });
      toast.success(`Order #${String(order.id).padStart(5, "0")} marked as ${newStatus}`);
      onStatusChange(order.id, newStatus);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Order Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Order ID</p>
            <p className="font-bold text-gray-900 text-sm">#{String(order.id).padStart(5, "0")}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Date</p>
            <p className="text-sm text-gray-700">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Order Value</p>
            <p className="text-sm font-bold text-gray-900 flex items-center gap-0.5"><IndianRupee className="w-3.5 h-3.5" />{Number(order.total_amount).toFixed(2)}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${st.color}`}>
          {st.icon} {order.status}
        </span>
      </div>

      {/* Buyer Info */}
      <div className="px-6 py-3 border-b border-gray-50 flex flex-wrap items-center gap-4 bg-blue-50/40">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User className="w-4 h-4 text-blue-400" />
          <span className="font-semibold">{order.buyer_name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Mail className="w-3.5 h-3.5" /> {order.buyer_email}
        </div>
        {order.buyer_phone && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Phone className="w-3.5 h-3.5" /> {order.buyer_phone}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="p-6">
        <div className="space-y-4">
          {order.items?.map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-14 h-18 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                {item.image_url ? (
                  <img src={`http://localhost:5000${item.image_url}`} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.author}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest flex-shrink-0 ${
                    item.type === "Purchase" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                  }`}>
                    {item.type}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="text-gray-500">Qty: <b className="text-gray-800">{item.quantity}</b></span>
                  <span className="font-bold text-gray-900 flex items-center gap-0.5">
                    <IndianRupee className="w-3.5 h-3.5" />{Number(item.price_at_purchase).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {actions.length > 0 && (
          <div className="mt-5 pt-5 border-t border-gray-100 flex gap-3 flex-wrap">
            {actions.map((action) => (
              <button
                key={action.status}
                onClick={() => handleAction(action.status)}
                disabled={updating}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${action.cls}`}
              >
                {updating ? "Updating..." : action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SellerOrders() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders/seller");
      setOrders(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "Seller" && user.role !== "Admin") { router.push("/"); return; }
    fetchOrders();
  }, [user, authLoading]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);

  const counts = ["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(s => ({
    label: s,
    count: s === "All" ? orders.length : orders.filter(o => o.status === s).length,
  }));

  if (authLoading) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center text-gray-400">
      <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" /> Loading...
    </div>
  );

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
              <Package className="w-8 h-8 text-primary-600" /> Incoming Orders
            </h1>
            <p className="text-gray-500 text-sm mt-1">Orders placed by buyers on your book listings</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {counts.map(({ label, count }) => (
          <button
            key={label}
            onClick={() => setFilter(label)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition border ${
              filter === label
                ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {label} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" /> Loading orders...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-gray-600 font-semibold mb-1">
            {filter === "All" ? "No orders yet" : `No ${filter.toLowerCase()} orders`}
          </h3>
          <p className="text-gray-400 text-sm">
            {filter === "All" ? "Orders from buyers will appear here once placed." : `Switch to another filter to see other orders.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
