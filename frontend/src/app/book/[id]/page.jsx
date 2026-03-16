"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Heart, ShieldCheck, Clock, MapPin, User, Star, CreditCard, Loader2, X, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Simple Payment Modal Component
const PaymentModal = ({ isOpen, onClose, onConfirm, amount, type, bookTitle }) => {
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = async () => {
    setProcessing(true);
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Payment Verification</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition"><X className="w-5 h-5 text-gray-500" /></button>
          </div>

          <div className="bg-primary-50 p-4 rounded-xl mb-6">
            <div className="flex justify-between text-sm text-primary-800 mb-1">
              <span>Book</span>
              <span className="font-semibold">{bookTitle}</span>
            </div>
            <div className="flex justify-between text-sm text-primary-800 mb-1">
              <span>Transaction Type</span>
              <span className="font-semibold">{type === 'Purchase' ? 'Buy' : 'Rent'}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-primary-900 pt-2 border-t border-primary-200 mt-2">
              <span>Total Amount</span>
              <span>${amount}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-xl bg-gray-50">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div className="flex-1 text-sm text-gray-600">Demo Card: **** **** **** 4242</div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex flex-col gap-3">
          <button 
            onClick={handlePay}
            disabled={processing}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-primary-200 transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Confirm & Pay ${amount}
              </>
            )}
          </button>
          <button 
            disabled={processing}
            onClick={onClose} 
            className="w-full text-gray-500 text-sm font-medium py-2 hover:text-gray-700 transition"
          >
            Cancel Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default function BookDetails({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingType, setPendingType] = useState(null);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await api.get(`/books/${id}`);
      setBook(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const addToWishlist = async () => {
    if (!user) return router.push('/login');
    const loadingToast = toast.loading('Adding to wishlist...');
    try {
      await api.post('/wishlist', { book_id: id });
      toast.success('Added to wishlist!', { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding to wishlist', { id: loadingToast });
    }
  };

  const initiatePurchase = (type) => {
    if (!user) return router.push('/login');
    if (type === 'Rent' && !book.rental_price_per_day) return toast.error('Not available for rent');
    if (type === 'Purchase' && !book.price) return toast.error('Not available for purchase');
    
    setPendingType(type);
    setShowPaymentModal(true);
  };

  const handlePurchase = async () => {
    const type = pendingType;
    setShowPaymentModal(false);
    const loadingToast = toast.loading(`Processing ${type === 'Purchase' ? 'purchase' : 'rental'}...`);
    
    try {
      const price = type === 'Purchase' ? book.price : book.rental_price_per_day;
      const items = [{
        book_id: book.id,
        quantity: 1,
        price: price,
        type: type,
        ...(type === 'Rent' && {
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
        })
      }];

      await api.post('/orders', { items, total_amount: price });
      toast.success(`Successfully ${type === 'Purchase' ? 'Purchased' : 'Rented'}!`, { id: loadingToast });
      router.push('/buyer/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing order', { id: loadingToast });
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Data...</div>;
  if (!book) return <div className="p-20 text-center">Book not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Image Container */}
        <div className="md:w-5/12 bg-gray-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
          {book.image_url ? (
            <img src={`http://localhost:5000${book.image_url}`} alt={book.title} className="max-h-[500px] object-contain shadow-lg rounded" />
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-gray-400">
              <span className="mb-2 uppercase text-xs font-bold tracking-widest text-primary-600 px-3 py-1 bg-primary-50 rounded-full">{book.category_name}</span>
              <span className="text-xl">No Image Available</span>
            </div>
          )}
        </div>

        {/* Right: Details & Actions */}
        <div className="md:w-7/12 p-8 lg:p-12 flex flex-col">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold mr-2">{book.category_name}</span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              book.condition_state === 'New' ? 'bg-green-100 text-green-700' : 
              book.condition_state === 'Good' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {book.condition_state} Condition
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-6">by {book.author}</p>
          
          <div className="flex flex-wrap items-center gap-6 py-4 border-y border-gray-100 mb-6 bg-gray-50/50 rounded-xl px-4">
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 border rounded-full text-primary-600 shadow-sm"><User className="w-4 h-4" /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Seller</p>
                <p className="font-semibold text-sm">{book.seller_name}</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 border rounded-full text-yellow-500 shadow-sm"><Star className="w-4 h-4" /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Seller Rating</p>
                <p className="font-semibold text-sm">{book.seller_rating ? `${Number(book.seller_rating).toFixed(1)}/5` : 'No reviews'}</p>
              </div>
            </div>
          </div>

          <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
            <h3 className="text-gray-900 font-semibold mb-2">Description</h3>
            <p className="whitespace-pre-line">{book.description || 'No description provided by the seller.'}</p>
          </div>

          {/* Pricing & Actions */}
          <div className="mt-auto">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {/* Buy Option */}
              {book.price && (
                <div className="border border-primary-100 bg-primary-50 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-primary-800">Buy Now</span>
                    <span className="text-2xl font-bold text-primary-700">${book.price}</span>
                  </div>
                  <div className="flex flex-col gap-2 transition-all">
                    <button onClick={() => initiatePurchase('Purchase')} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium shadow-sm transition flex justify-center items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Buy Now
                    </button>
                    <button onClick={() => addToCart(book)} className="w-full bg-white border border-primary-200 text-primary-600 hover:bg-primary-50 py-2.5 rounded-lg font-medium transition flex justify-center items-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
                </div>
              )}

              {/* Rent Option */}
              {book.rental_price_per_day && (
                <div className="border border-green-100 bg-green-50 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-green-800">Rent</span>
                    <span className="text-2xl font-bold text-green-700">${book.rental_price_per_day}<span className="text-sm font-normal text-green-600">/day</span></span>
                  </div>
                  <button onClick={() => initiatePurchase('Rent')} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium shadow-sm transition flex justify-center items-center gap-2">
                    <Clock className="w-4 h-4" /> Rent Book
                  </button>
                </div>
              )}
            </div>

            <PaymentModal 
              isOpen={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              onConfirm={handlePurchase}
              amount={pendingType === 'Purchase' ? book.price : book.rental_price_per_day}
              type={pendingType}
              bookTitle={book.title}
            />

            <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Secure transaction
              </span>
              <button onClick={addToWishlist} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-500 transition px-3 py-1.5 border rounded-lg hover:border-red-200 hover:bg-red-50">
                <Heart className="w-4 h-4" /> Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
