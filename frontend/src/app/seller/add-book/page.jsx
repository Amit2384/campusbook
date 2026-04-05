"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle } from "lucide-react";

export default function AddBook() {
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "", author: "", description: "", category_id: "", 
    condition_state: "Good", price: "", rental_price_per_day: "", available_quantity: 1
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'Seller' && user.role !== 'Admin') {
      router.push('/');
    }
    api.get('/books/categories').then(res => setCategories(res.data)).catch(console.error);
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      await api.post('/books', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Book listed successfully! Waiting for admin approval.");
      router.push('/seller/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Error listing book");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">List a New Book</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Title *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500" placeholder="e.g. Introduction to Algorithms" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
            <input type="text" name="author" required value={formData.author} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="category_id" required value={formData.category_id} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500 bg-white">
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500" placeholder="Details about this edition, any highlights etc..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
            <select name="condition_state" required value={formData.condition_state} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500 bg-white">
              <option value="New">New - Perfect condition, unused</option>
              <option value="Good">Good - Lightly used, no missing pages</option>
              <option value="Acceptable">Acceptable - Well used, may have highlights/notes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input type="number" name="available_quantity" min="1" required value={formData.available_quantity} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500" />
          </div>

          <div className="bg-gray-50 p-4 border rounded-lg md:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4">Pricing Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹)</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500" placeholder="Optional" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rental Price / Day (₹)</label>
                <input type="number" step="0.01" name="rental_price_per_day" value={formData.rental_price_per_day} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500" placeholder="Optional" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">* Provide at least one pricing option to list the book for sale, rent, or both.</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition relative">
              <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {image ? (
                <div className="text-center">
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">{image.name}</p>
                  <p className="text-xs text-gray-500">Click to change image</p>
                </div>
              ) : (
                <div className="text-center pointer-events-none">
                  <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Click or drag image to upload</p>
                  <p className="text-xs text-gray-500">JPG, PNG, WEBP up to 5MB</p>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-4 border-t pt-6">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
          <button type="submit" disabled={loading} className="px-8 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-sm disabled:opacity-50">
            {loading ? 'Listing Book...' : 'Submit Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
