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
    <div className="relative min-h-[calc(100vh-4rem)] bg-gray-50 pb-20">
      {/* Dark Blue Header Background */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-br from-[#0a1e3f] to-[#154682] z-0"></div>
      
      <div className="max-w-4xl mx-auto px-4 pt-12 relative z-10">
        <Link href="/buyer/dashboard" className="inline-flex items-center text-sm text-blue-200 hover:text-white mb-10 transition">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>

        {/* Profile Header Block embedded in the blue area */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12 px-2 md:px-6">
          <div className="relative">
            <div className="w-[120px] h-[120px] rounded-full bg-blue-900 border-[3px] border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center justify-center overflow-hidden">
              {profileData.profile_image ? (
                <img 
                  src={`http://localhost:5000${profileData.profile_image}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-blue-300" />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-white text-gray-500 p-2 rounded-full shadow-lg border-2 border-white cursor-pointer hover:text-primary-600 transition">
              <Camera className="w-4 h-4" />
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
            </label>
          </div>
          <div className="text-center md:text-left text-white">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">{profileData.name}</h1>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <span className="px-3 py-1 bg-blue-600/50 border border-blue-400 rounded text-xs font-bold tracking-widest uppercase">
                {profileData.role}
              </span>
              <span className="text-blue-200 text-sm">Member since 2024</span>
            </div>
          </div>
        </div>

        {/* Floating Split Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Account Details */}
            <div className="space-y-8">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Account Details</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Email Address</p>
                    <p className="text-gray-900 font-semibold">{profileData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Phone Number</p>
                    <p className="text-gray-900 font-semibold">{profileData.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Account Security</p>
                    <p className="text-gray-900 font-semibold">Verified Account</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions overlay */}
            <div className="relative">
               {/* Vertical Divider line for desktop */}
              <div className="hidden md:block absolute -left-6 top-4 bottom-4 w-px bg-gray-100"></div>
              
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <Link href="/buyer/orders" className="p-6 bg-[#e6f4ea] rounded-2xl hover:scale-105 transition-transform flex flex-col items-center justify-center text-center h-32">
                  <ShoppingBag className="w-7 h-7 text-[#1e8e3e] mb-2" />
                  <p className="text-sm font-semibold text-[#1e8e3e]">Orders</p>
                </Link>
                
                <Link href="/buyer/wishlist" className="p-6 bg-[#fce8e6] rounded-2xl hover:scale-105 transition-transform flex flex-col items-center justify-center text-center h-32">
                  <Heart className="w-7 h-7 text-[#d93025] mb-2" />
                  <p className="text-sm font-semibold text-[#d93025]">Wishlist</p>
                </Link>

                <Link href="/buyer/rentals" className="p-6 bg-[#e8effd] rounded-2xl hover:scale-105 transition-transform flex flex-col items-center justify-center text-center h-32">
                  <Clock className="w-7 h-7 text-[#1967d2] mb-2" />
                  <p className="text-sm font-semibold text-[#1967d2]">Rentals</p>
                </Link>

                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-6 bg-[#f1f3f4] rounded-2xl hover:scale-105 transition-transform flex flex-col items-center justify-center text-center h-32"
                >
                  <User className="w-7 h-7 text-[#5f6368] mb-2" />
                  <p className="text-sm font-semibold text-[#5f6368]">Edit Info</p>
                </button>
              </div>
            </div>

          </div>

          {/* Deactivate Option */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex justify-center">
             <button className="text-[#d93025] text-sm hover:underline font-medium transition cursor-help">Deactivate Account</button>
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
