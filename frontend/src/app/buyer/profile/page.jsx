"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Mail, Phone, Shield, ArrowLeft, Heart, ShoppingBag, Clock, Camera, Loader2 } from "lucide-react";
import api from "@/lib/api";
import EditProfileModal from "@/components/EditProfileModal";
import toast from "react-hot-toast";

export default function BuyerProfile() {
  const { user, updateUserData } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setProfileData(res.data);
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
      <Link href="/buyer/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-8 transition">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
        {/* Header Profile Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-12 text-white relative">
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
              <label className="absolute -bottom-2 -right-2 bg-white text-primary-600 p-2 rounded-xl shadow-lg cursor-pointer hover:scale-110 transition border border-primary-100">
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
                <span className="text-primary-100 text-sm">Member since 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Account Details */}
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Account Information</h2>
              
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400"><Mail className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address</p>
                  <p className="text-gray-900 font-medium">{profileData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400"><Phone className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Phone Number</p>
                  <p className="text-gray-900 font-medium">{profileData.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400"><Shield className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Account Security</p>
                  <p className="text-gray-900 font-medium">Verified Account</p>
                </div>
              </div>
            </div>

            {/* Quick Stats/Actions */}
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Activity Summary</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <Link href="/buyer/orders" className="p-6 bg-green-50 rounded-2xl border border-green-100 hover:bg-green-100 transition group text-center">
                  <ShoppingBag className="w-6 h-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition" />
                  <p className="text-sm font-bold text-green-900">Orders</p>
                </Link>
                
                <Link href="/buyer/wishlist" className="p-6 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition group text-center">
                  <Heart className="w-6 h-6 text-red-600 mx-auto mb-2 group-hover:scale-110 transition" />
                  <p className="text-sm font-bold text-red-900">Wishlist</p>
                </Link>

                <Link href="/buyer/rentals" className="p-6 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100 transition group text-center">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition" />
                  <p className="text-sm font-bold text-blue-900">Rentals</p>
                </Link>

                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center hover:bg-gray-100 transition group"
                >
                  <User className="w-6 h-6 text-gray-400 mx-auto mb-2 group-hover:text-primary-600 transition" />
                  <p className="text-sm font-bold text-gray-900">Edit Info</p>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
             <button className="text-gray-400 text-sm hover:text-red-500 font-medium transition cursor-help">Deactivate Account</button>
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
