"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Package, ArrowLeft, RefreshCw, User, IndianRupee, Clock, CheckCircle, Truck, XCircle } from "lucide-react";

export default function AdminOrders() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/orders");
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
    if (user.role !== "Admin") { router.push("/"); return; }
    fetchOrders();
  }, [user, authLoading]);

  if (authLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
      <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" /> Loading...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-5 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Package className="w-8 h-8 text-primary-600" /> All Platform Orders
            </h1>
            <p className="text-gray-500 text-sm mt-1">Overview of all orders placed by buyers across the platform.</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" /> Loading orders...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="px-6 py-4">Order ID & Date</th>
                  <th className="px-6 py-4">Buyer Info</th>
                  <th className="px-6 py-4">Items Summary</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">#{String(o.id).padStart(5, "0")}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-medium text-gray-900">
                        <User className="w-4 h-4 text-gray-400" /> {o.buyer_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 ml-6">{o.buyer_email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">{o.items?.length || 0} items</div>
                      {o.items?.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-500 truncate mt-0.5 max-w-[200px]">
                          • {item.title} ({item.type})
                        </div>
                      ))}
                      {o.items?.length > 2 && (
                        <div className="text-xs text-gray-400 mt-0.5 italic">...and {o.items.length - 2} more</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 flex items-center gap-0.5">
                        <IndianRupee className="w-3.5 h-3.5 text-gray-500" /> {o.total_amount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        o.status === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        o.status === "Confirmed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        o.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {o.status === "Pending" && <Clock className="w-3 h-3" />}
                        {o.status === "Confirmed" && <Truck className="w-3 h-3" />}
                        {o.status === "Completed" && <CheckCircle className="w-3 h-3" />}
                        {o.status === "Cancelled" && <XCircle className="w-3 h-3" />}
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No orders found on the platform yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
