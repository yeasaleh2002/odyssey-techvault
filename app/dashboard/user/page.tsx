"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  ShoppingBag, 
  Heart, 
  Clock, 
  User as UserIcon,
  Mail,
  Shield
} from "lucide-react";
import Link from "next/link";
export default function UserDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
         {/* Profile Card */}
         <div className="w-full md:w-80 bg-card border border-border rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col items-center text-center">
               <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 relative">
                  <UserIcon className="w-10 h-10" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-background border-4 border-card rounded-full flex items-center justify-center">
                     <Shield className="w-4 h-4 text-primary" />
                  </div>
               </div>
               <h2 className="text-xl font-bold text-foreground mb-1">{user.name || user.displayName || "Tech Explorer"}</h2>
               <p className="text-sm text-muted-foreground mb-6 inline-flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {user.email}
               </p>
               
               <div className="w-full grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-2xl">
                     <p className="text-xs text-muted-foreground mb-1">Joined</p>
                     <p className="text-sm font-semibold">{new Date(user.createdAt || Date.now()).getFullYear()}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-2xl">
                     <p className="text-xs text-muted-foreground mb-1">Role</p>
                     <p className="text-sm font-semibold capitalize">{user.role}</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Stats and Activity */}
         <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">

            <div className="p-6 bg-card border border-border rounded-3xl shadow-sm">
               <div className="flex justify-between items-start mb-4">
                  <ShoppingBag className="w-6 h-6 text-blue-500" />
               </div>
               <h3 className="text-3xl font-bold mb-1">0</h3>
               <p className="text-sm text-muted-foreground">Orders Placed</p>
            </div>

            <div className="p-6 bg-card border border-border rounded-3xl shadow-sm">
               <div className="flex justify-between items-start mb-4">
                  <Heart className="w-6 h-6 text-red-500" />
               </div>
               <h3 className="text-3xl font-bold mb-1">0</h3>
               <p className="text-sm text-muted-foreground">Wishlist Items</p>
            </div>
         </div>
      </div>

      {/* Recent Activity */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
        <div className="space-y-4">
           {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:bg-muted/30 transition-colors">
                 <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                 </div>
                 <div className="flex-1">
                    <p className="text-sm font-medium">Logged in to the dashboard</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                 </div>
              </div>
           ))}
        </div>
      </section>
    </div>
  );
}
