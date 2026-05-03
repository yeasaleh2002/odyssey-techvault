"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Package, 
  ShoppingBag, 
  Heart, 
  Clock, 
  ArrowUpRight,
  User as UserIcon,
  Mail,
  Shield
} from "lucide-react";
import { getProducts } from "@/lib/services/product";
import { ProductCard, LoadingSpinner, SectionTitle } from "@/components/shared";
import { Product } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UserDashboard() {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        // ideally backend has /api/products/me or filters by creator
        const data = await getProducts();
        if (data.success) {
          // Simulation: filter items created by the user if the field exists
          // Since we don't have a specific endpoint, we just show some items
          setMyProducts(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load your items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, []);

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
         <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            <div className="p-6 bg-primary text-primary-foreground rounded-3xl shadow-lg shadow-primary/20">
               <div className="flex justify-between items-start mb-4">
                  <Package className="w-6 h-6 opacity-80" />
                  <ArrowUpRight className="w-5 h-5 opacity-80" />
               </div>
               <h3 className="text-3xl font-bold mb-1">{myProducts.length}</h3>
               <p className="text-sm opacity-80">Active Listings</p>
            </div>

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

      {/* My Items Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-2xl font-bold text-foreground">My Recent Listings</h2>
           <Link href="/items/manage" className="text-sm font-medium text-primary hover:underline">
             Manage All
           </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="md" />
          </div>
        ) : myProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {myProducts.map((product, index) => (
                <ProductCard key={product.id || (product as any)._id} product={product} index={index} />
             ))}
          </div>
        ) : (
          <div className="p-12 bg-muted/30 border border-border border-dashed rounded-3xl text-center">
             <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
             <p className="text-muted-foreground">You haven't listed any products yet.</p>
             <Link href="/items/add" className="mt-4 inline-flex text-primary font-semibold hover:underline">
               Start Selling Now
             </Link>
          </div>
        )}
      </section>

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
