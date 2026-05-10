"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft,
  MapPin, CreditCard, CheckCircle2, Loader2, Package, X
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/shared";
import { createOrder } from "@/lib/services/orders";
import toast from "react-hot-toast";

const PAYMENT_METHODS = ["Credit Card", "Debit Card", "PayPal", "Cash on Delivery"];

type Step = "cart" | "shipping" | "payment" | "success";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("cart");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/cart");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.name) {
      setShipping((prev) => ({ ...prev, fullName: user.name || "" }));
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ── Success Screen ──────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Placed! 🎉</h1>
          <p className="text-muted-foreground mb-4">
            Your order has been saved and will be shipped soon.
          </p>
          {orderId && (
            <div className="bg-muted rounded-xl p-3 inline-block mb-6">
              <p className="text-xs text-muted-foreground">Order ID</p>
              <p className="font-mono font-semibold text-foreground">
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

  // ── Empty Cart ──────────────────────────────────────────────
  if (items.length === 0 && step === "cart") {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex p-6 bg-muted rounded-full mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some products to get started.
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

  // ── Shipping Step ────────────────────────────────────────────
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.address || !shipping.city || !shipping.postalCode || !shipping.country) {
      toast.error("Please fill in all shipping fields");
      return;
    }
    setStep("payment");
  };

  // ── Place Order ──────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        product: (item.product as any)._id || (item.product as any).id,
        quantity: item.quantity,
        price: (item.product as any).price,
      }));

      // 1️⃣ POST to /api/orders — backend saves to DB and clears cart atomically
      const res = await createOrder({
        items: orderItems,
        totalAmount: totalPrice,
        shippingAddress: shipping,
        paymentMethod,
      });

      if (res.success) {
        setOrderId(res.data._id);
        // Backend already cleared cart — just reset local state
        await clearCart(true);
        setStep("success");
        toast.success("Order placed successfully!");
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to place order";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Progress Indicator ───────────────────────────────────────
  const steps = [
    { key: "cart", label: "Cart" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
  ];
  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header + Progress */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {step === "cart" && `Shopping Cart (${totalItems})`}
            {step === "shipping" && "Shipping Address"}
            {step === "payment" && "Payment"}
          </h1>

          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                {i > 0 && (
                  <div className={`h-px w-8 sm:w-16 transition-colors ${i <= stepIndex ? "bg-primary" : "bg-border"}`} />
                )}
                <div className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  i === stepIndex ? "text-primary" : i < stepIndex ? "text-green-500" : "text-muted-foreground"
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i === stepIndex ? "bg-primary text-primary-foreground" : i < stepIndex ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {i < stepIndex ? "✓" : i + 1}
                  </div>
                  <span className="hidden sm:block">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">

            {/* ── STEP: CART ── */}
            {step === "cart" && (
              <div className="space-y-4">
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
                        transition={{ duration: 0.3 }}
                        className="flex gap-4 p-4 bg-card border border-border rounded-2xl"
                      >
                        <Link href={`/items/${pid}`} className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e: any) => { e.target.src = "https://placehold.co/80x80/1a1a2e/ffffff?text=P"; }}
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link href={`/items/${pid}`}>
                            <p className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                              {product.title}
                            </p>
                          </Link>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <p className="text-lg font-bold text-primary mt-1">${product.price?.toFixed(2)}</p>
                        </div>

                        <div className="flex flex-col items-end justify-between gap-2">
                          <button
                            onClick={() => removeFromCart(pid)}
                            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
                            <button
                              onClick={() => updateQuantity(pid, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-card transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
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

                <div className="flex items-center justify-between">
                  <Link href="/items" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                  </Link>
                  <button
                    onClick={() => clearCart()}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <X className="w-4 h-4" /> Clear Cart
                  </button>
                </div>

                <button
                  onClick={() => setStep("shipping")}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ── STEP: SHIPPING ── */}
            {step === "shipping" && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Shipping Address</h2>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  {[
                    { label: "Full Name", key: "fullName", placeholder: "John Doe", type: "text" },
                    { label: "Street Address", key: "address", placeholder: "123 Main Street, Apt 4B", type: "text" },
                    { label: "City", key: "city", placeholder: "New York", type: "text" },
                    { label: "Postal Code", key: "postalCode", placeholder: "10001", type: "text" },
                    { label: "Country", key: "country", placeholder: "United States", type: "text" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        {field.label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={field.type}
                        value={(shipping as any)[field.key]}
                        onChange={(e) => setShipping({ ...shipping, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  ))}

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep("cart")}
                      className="flex-1 py-3 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── STEP: PAYMENT ── */}
            {step === "payment" && (
              <div className="space-y-5">
                {/* Shipping summary */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <MapPin className="w-4 h-4 text-primary" /> Shipping To
                    </div>
                    <button onClick={() => setStep("shipping")} className="text-sm text-primary hover:underline">Edit</button>
                  </div>
                  <p className="text-sm font-medium text-foreground">{shipping.fullName}</p>
                  <p className="text-sm text-muted-foreground">{shipping.address}</p>
                  <p className="text-sm text-muted-foreground">{shipping.city}, {shipping.postalCode}</p>
                  <p className="text-sm text-muted-foreground">{shipping.country}</p>
                </div>

                {/* Payment method */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Payment Method</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                          paymentMethod === method
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-muted-foreground"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
                  ) : (
                    <><ShoppingBag className="w-5 h-5" /> Place Order · ${totalPrice.toFixed(2)}</>
                  )}
                </button>

                <button
                  onClick={() => setStep("shipping")}
                  className="w-full py-2.5 text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Shipping
                </button>

                <p className="text-xs text-center text-muted-foreground">
                  Your cart will only be cleared after your order is successfully saved.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Order Summary
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-4">
                {items.map((item) => {
                  const product = item.product as any;
                  const pid = product._id || product.id;
                  return (
                    <div key={pid} className="flex gap-3 items-center">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0"
                        onError={(e: any) => { e.target.src = "https://placehold.co/48x48/1a1a2e/ffffff?text=P"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{product.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-foreground flex-shrink-0">
                        ${(product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t border-border mt-3 pt-4 flex justify-between items-center">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
