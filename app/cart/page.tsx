"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/shared";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/cart");
    }
  }, [user, loading, router]);

  const handleCheckout = async () => {
    if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address) {
      toast.error("Please fill in all delivery information");
      return;
    }

    setIsCheckingOut(true);
    // Simulate checkout process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Order placed successfully!");
    clearCart();
    setIsCheckingOut(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex p-6 bg-muted rounded-full mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/items"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-foreground mb-8"
        >
          Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-4 p-4 bg-card border border-border rounded-2xl"
                >
                  {/* Image */}
                  <Link
                    href={`/items/${item.product.id}`}
                    className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-muted"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/items/${item.product.id}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{item.product.category}</p>
                    <p className="text-lg font-bold text-foreground">
                      ${item.product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear entire cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24 p-6 bg-card border border-border rounded-2xl"
            >
              <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span>${(totalPrice * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6 pt-6 border-t border-border">
                <h3 className="font-medium text-foreground">Delivery Information</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={deliveryInfo.name}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, name: e.target.value })}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={deliveryInfo.phone}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <textarea
                  placeholder="Shipping Address"
                  value={deliveryInfo.address}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {isCheckingOut ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="mt-4 text-xs text-center text-muted-foreground">
                Secure checkout powered by Stripe
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
