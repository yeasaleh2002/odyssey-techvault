"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  Heart,
  Clock,
  User as UserIcon,
  Mail,
  Shield,
  ShoppingCart,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getMyOrders } from "@/lib/services/orders";
import { getWishlist } from "@/lib/services/wishlist";
import { useCart } from "@/context/CartContext";

export default function UserDashboard() {
  const { user } = useAuth();
  const { items: cartItems, totalItems } = useCart();
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, wishlistRes] = await Promise.all([
          getMyOrders(),
          getWishlist(),
        ]);
        if (ordersRes.success) {
          setOrderCount(ordersRes.data.length);
          setRecentOrders(ordersRes.data.slice(0, 3));
        }
        if (wishlistRes.success) {
          setWishlistCount(wishlistRes.data.length);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!user) return null;

  const statusColors: Record<string, string> = {
    Processing: "bg-amber-100 text-amber-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

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
            <h2 className="text-xl font-bold text-foreground mb-1">
              {user.name || (user as any).displayName || "Tech Explorer"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6 inline-flex items-center gap-1">
              <Mail className="w-3 h-3" /> {user.email}
            </p>

            <div className="w-full grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/50 rounded-2xl">
                <p className="text-xs text-muted-foreground mb-1">Joined</p>
                <p className="text-sm font-semibold">
                  {new Date((user as any).createdAt || Date.now()).getFullYear()}
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-2xl">
                <p className="text-xs text-muted-foreground mb-1">Role</p>
                <p className="text-sm font-semibold capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
          <Link
            href="/dashboard/user/orders"
            className="p-6 bg-card border border-border rounded-3xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-4">
              <ShoppingBag className="w-6 h-6 text-blue-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mb-1" />
            ) : (
              <h3 className="text-3xl font-bold mb-1">{orderCount}</h3>
            )}
            <p className="text-sm text-muted-foreground">Orders Placed</p>
          </Link>

          <Link
            href="/dashboard/user/wishlist"
            className="p-6 bg-card border border-border rounded-3xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-4">
              <Heart className="w-6 h-6 text-red-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mb-1" />
            ) : (
              <h3 className="text-3xl font-bold mb-1">{wishlistCount}</h3>
            )}
            <p className="text-sm text-muted-foreground">Wishlist Items</p>
          </Link>

          <Link
            href="/dashboard/user/cart"
            className="p-6 bg-card border border-border rounded-3xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-4">
              <ShoppingCart className="w-6 h-6 text-green-500" />
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{totalItems}</h3>
            <p className="text-sm text-muted-foreground">Cart Items</p>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-foreground">Recent Orders</h2>
          <Link href="/dashboard/user/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex items-center gap-4 p-6 bg-card border border-dashed border-border rounded-2xl text-muted-foreground">
            <Clock className="w-8 h-8 opacity-40" />
            <div>
              <p className="font-medium">No orders yet</p>
              <Link href="/items" className="text-sm text-primary hover:underline">Browse products →</Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:bg-muted/30 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.items?.length} item(s) · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.orderStatus] || "bg-muted text-muted-foreground"}`}>
                    {order.orderStatus}
                  </span>
                  <span className="font-bold text-foreground">${order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
