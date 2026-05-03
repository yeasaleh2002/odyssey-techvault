"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Shield, Calendar, Edit2, Check, X, Camera } from "lucide-react";
import { SectionTitle, LoadingSpinner } from "@/components/shared";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function UserProfilePage() {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || user?.displayName || "");

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!user) return null;

  const handleUpdateProfile = () => {
    // In a real app: await updateProfile({ name });
    toast.success("Profile updated successfully (Simulated)");
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionTitle 
        title="My Profile" 
        subtitle="Manage your personal information and account settings"
      />

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Avatar */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-8 bg-card border border-border rounded-3xl text-center relative overflow-hidden group">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl font-bold border-4 border-card shadow-lg">
                {(name || user.email)?.[0].toUpperCase()}
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                 <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold truncate">{name}</h3>
            <p className="text-sm text-muted-foreground mb-4 uppercase tracking-tighter font-semibold">{user.role}</p>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               Verified Account
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2 space-y-6">
           <div className="p-8 bg-card border border-border rounded-3xl space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                 </h3>
                 <button 
                   onClick={() => setIsEditing(!isEditing)}
                   className="p-2 text-muted-foreground hover:text-primary transition-colors"
                 >
                    {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-4 h-4" />}
                 </button>
              </div>

              <div className="grid gap-6">
                 <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Full Name</label>
                    {isEditing ? (
                       <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="flex-1 px-4 py-2 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                          />
                          <button 
                            onClick={handleUpdateProfile}
                            className="p-2 bg-primary text-primary-foreground rounded-xl"
                          >
                             <Check className="w-5 h-5" />
                          </button>
                       </div>
                    ) : (
                       <p className="text-base font-semibold">{name}</p>
                    )}
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email Address</label>
                    <div className="flex items-center gap-2">
                       <p className="text-base font-semibold">{user.email}</p>
                       <Shield className="w-4 h-4 text-green-500" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-medium text-muted-foreground mb-1.5">Account Role</label>
                       <p className="text-base font-semibold capitalize">{user.role}</p>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-muted-foreground mb-1.5">Joined TechVault</label>
                       <p className="text-base font-semibold">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Account Security */}
           <div className="p-8 bg-card border border-border rounded-3xl shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <Shield className="w-5 h-5 text-primary" />
                 Account Security
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border">
                    <div>
                       <p className="font-semibold">Password</p>
                       <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors">
                       Change
                    </button>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border">
                    <div>
                       <p className="font-semibold">Two-Factor Authentication</p>
                       <p className="text-sm text-muted-foreground">Enable for extra security</p>
                    </div>
                    <div className="w-12 h-6 bg-muted border border-border rounded-full relative p-1 cursor-not-allowed opacity-50">
                       <div className="w-4 h-4 bg-muted-foreground rounded-full" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
