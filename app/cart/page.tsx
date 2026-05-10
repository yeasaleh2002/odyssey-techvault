"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowLeft,
  CheckCircle2, Loader2, Package, X, Lock, Phone, MapPin, User
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/shared";
import { createOrder } from "@/lib/services/orders";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [delivery, setDelivery] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  // Pre-fill name from user profile
  useEffect(() => {
    if (user?.name) {
      setDelivery((prev) => ({ ...prev, fullName: user.name || "" }));
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/cart");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Placed! 🎉</h1>
          <p className="text-muted-foreground mb-4">
            Your order has been saved to our system and will be processed shortly.
          </p>
          {orderId && (
            <div className="bg-muted rounded-xl px-5 py-3 inline-block mb-6 border border-border">
              <p className="text-xs text-muted-foreground mb-0.5">Order Reference</p>
              <p className="font-mono font-bold text-foreground tracking-wider">
                #{orderId.slice(-12).toUpperCase()}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard/user/orders"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <Package className="w-5 h-5" /> View My Orders
            </Link>
            <Link
              href="/items"
              className="flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Empty Cart ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex p-6 bg-muted rounded-full mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven&apos;t added any items yet.
            </p>
            <Link
              href="/items"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Browse Products
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Checkout Handler — Save to DB ────────────────────────────────────────────
  const handleCheckout = async () => {
    if (!delivery.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!delivery.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!delivery.address.trim()) {
      toast.error("Please enter your shipping address");
      return;
    }

    setSubmitting(true);
    try {
      // Build order items from current cart
      const orderItems = items.map((item) => ({
        product: (item.product as any)._id || (item.product as any).id,
        quantity: item.quantity,
        price: (item.product as any).price,
      }));

      // POST to /api/orders — saves to Orders collection in MongoDB (tied to user._id)
      // Backend also clears user.cart atomically after saving the order
      const res = await createOrder({
        items: orderItems,
        totalAmount: totalPrice,
        shippingAddress: {
          fullName: delivery.fullName,
          address: delivery.address,
          city: "N/A",           // phone-based checkout — city not required
          postalCode: "N/A",
          country: "N/A",
          phone: delivery.phone, // stored in address object
        },
        paymentMethod: "Cash on Delivery",
      });

      if (res.success) {
        setOrderId(res.data._id);
        // Backend already cleared cart in DB — sync local state only
        await clearCart(true);
        setOrderSuccess(true);
        toast.success("Order placed successfully!");
      } else {
        toast.error(res.error || "Failed to place order");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to place order. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Main Cart Page ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/items"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            Shopping Cart{" "}
            <span className="text-muted-foreground font-normal text-xl">({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left: Cart Items ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const product = item.product as any;
                const pid = product._id || product.id;
                return (
                  <motion.div
                    key={pid}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-4 p-4 bg-card border border-border rounded-2xl"
                  >
                    {/* Thumbnail */}
                    <Link href={`/items/${pid}`} className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e: any) => { e.target.src = "https://placehold.co/80x80/1a1a2e/ffffff?text=P"; }}
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/items/${pid}`}>
                        <p className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 text-sm">
                          {product.title}
                        </p>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                      <p className="text-lg font-bold text-primary mt-1">${product.price?.toFixed(2)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end justify-between gap-2">
                      <button
                        onClick={() => removeFromCart(pid)}
                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(pid, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-card transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(pid, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-card transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-sm font-bold text-foreground">
                        ${(product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Clear cart */}
            <div className="flex justify-end">
              <button
                onClick={() => clearCart()}
                className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <X className="w-4 h-4" /> Clear Cart
              </button>
            </div>
          </div>

          {/* ── Right: Order Summary + Delivery Info ─────────────── */}
          <div className="lg:col-span-1 space-y-5">

            {/* Order Summary */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" /> Order Summary
              </h2>

              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1 mb-4">
                {items.map((item) => {
                  const product = item.product as any;
                  const pid = product._id || product.id;
                  return (
                    <div key={pid} className="flex gap-2.5 items-center">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-10 h-10 rounded-lg object-cover border border-border flex-shrink-0"
                        onError={(e: any) => { e.target.src = "https://placehold.co/40x40/1a1a2e/ffffff?text=P"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground line-clamp-1">{product.title}</p>
                        <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground flex-shrink-0">
                        ${(product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t border-border mt-3 pt-3 flex justify-between items-center">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Delivery Information
              </h2>

              <div className="space-y-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={delivery.fullName}
                      onChange={(e) => setDelivery({ ...delivery, fullName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={delivery.phone}
                      onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                    Shipping Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={delivery.address}
                    onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                    placeholder="123 Main Street, City, Country"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Checkout · ${totalPrice.toFixed(2)}
                  </>
                )}
              </button>

              <p className="mt-3 text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Secure checkout powered by Stripe
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
