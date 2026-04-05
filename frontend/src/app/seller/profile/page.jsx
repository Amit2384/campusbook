"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Mail, Phone, Shield, ArrowLeft, Package, Star, BookOpen, BarChart3, Camera, Loader2 } from "lucide-react";
import api from "@/lib/api";
import EditProfileModal from "@/components/EditProfileModal";
import toast from "react-hot-toast";

export default function SellerProfile() {
  const { user, loading: authLoading, updateUserData } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [sellerStats, setSellerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (authLoading) return;  // wait for auth to resolve
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        api.get("/auth/profile"),
        api.get("/books/seller/stats"),
      ]);
      setProfileData(profileRes.data);
      setSellerStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    const toastId = toast.loading("Uploading photo...");
    try {
      const res = await api.post("/auth/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfileData({ ...profileData, profile_image: res.data.profile_image });
      updateUserData({ profile_image: res.data.profile_image });
      toast.success("Profile photo updated!", { id: toastId });
    } catch (err) {
      toast.error("Failed to upload photo", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500">Loading profile...</div>;
  if (!user || !profileData) return <div className="p-20 text-center">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/seller/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-8 transition">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
        {/* Header Profile Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 px-8 py-12 text-white relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner overflow-hidden">
                {profileData.profile_image ? (
                  <img 
                    src={`http://localhost:5000${profileData.profile_image}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-white text-emerald-600 p-2 rounded-xl shadow-lg cursor-pointer hover:scale-110 transition border border-emerald-100">
                <Camera className="w-4 h-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-extrabold">{profileData.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold tracking-wider uppercase">
                  {profileData.role}
                </span>
                <span className="text-emerald-100 text-sm">Top Rated Seller</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Account Details */}
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Seller Information</h2>
              
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400"><Mail className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Business Email</p>
                  <p className="text-gray-900 font-medium">{profileData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400"><Phone className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Contact Phone</p>
                  <p className="text-gray-900 font-medium">{profileData.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400"><Shield className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Store Status</p>
                  <p className="text-gray-900 font-medium">Active & Verified</p>
                </div>
              </div>
            </div>

            {/* Seller Stats */}
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Performance</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                  <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-black text-blue-900">{sellerStats?.totalListed ?? "—"}</p>
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-tighter">Listed</p>
                </div>
                
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <Package className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-black text-emerald-900">{sellerStats?.booksSold ?? "—"}</p>
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-tighter">Sold</p>
                </div>

                <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-100 text-center">
                  <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-black text-yellow-900">{sellerStats?.avgRating ?? "N/A"}</p>
                  <p className="text-xs font-bold text-yellow-700 uppercase tracking-tighter">Rating</p>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center flex flex-col items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-xs font-bold text-gray-900 uppercase">Insights</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center text-gray-400 text-sm">
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-primary-600 font-bold hover:underline transition"
                >
                  Edit Information
                </button>
                <span>•</span>
                <p>Last login: Today at 12:45 PM</p>
             </div>
             <button className="text-primary-600 font-bold hover:underline transition">Request Feature: Payouts</button>
          </div>
        </div>

        <EditProfileModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={profileData}
          onUpdate={(updatedData) => {
            setProfileData(updatedData);
            updateUserData(updatedData);
          }}
        />
      </div>
    </div>
  );
}
