"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ArrowLeft, Clock, Calendar, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
                    <p className="text-sm font-bold text-gray-900">${order.total_amount}</p>
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
                        <div className="mt-2 font-semibold text-gray-900">${item.price_at_purchase}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
