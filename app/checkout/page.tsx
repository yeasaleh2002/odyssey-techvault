"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/lib/services/orders";
import {
  MapPin, CreditCard, ShoppingBag, ArrowLeft,
  CheckCircle2, Loader2, Package
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const PAYMENT_METHODS = ["Credit Card", "Debit Card", "PayPal", "Cash on Delivery"];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();

  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [shipping, setShipping] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  // Redirect if not logged in
  if (!user) {
    router.push("/login");
    return null;
  }

  // Redirect if cart is empty (but don't redirect if we just placed an order)
  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
          <Link
            href="/items"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.address || !shipping.city || !shipping.postalCode || !shipping.country) {
      toast.error("Please fill in all shipping fields");
      return;
    }
    setStep("payment");
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      // Build order items from cart
      const orderItems = items.map((item) => {
        const product = item.product as any;
        const productId = product._id || product.id || (typeof product === "string" ? product : null);
        
        return {
          product: productId,
          quantity: Number(item.quantity),
          price: Number(product.price),
        };
      });

      const orderData = {
        items: orderItems,
        totalAmount: totalPrice,
        shippingAddress: shipping,
        paymentMethod,
      };

      const res = await createOrder(orderData);

      if (res.success) {
        setOrderId(res.data._id);
        setStep("success");
        // Backend already cleared cart in DB — just reset local state
        await clearCart(true);
        toast.success("Order placed successfully! 🎉");
      } else {
        toast.error("Failed to place order");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── SUCCESS SCREEN ────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Placed!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your order. We'll get it shipped as soon as possible.
          </p>
          {orderId && (
            <p className="text-sm font-mono bg-muted px-4 py-2 rounded-lg inline-block mb-6 text-muted-foreground">
              Order ID: #{orderId.slice(-10).toUpperCase()}
            </p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/user/cart"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>

          {/* Progress */}
          <div className="flex items-center gap-3 mt-4">
            {[
              { key: "shipping", label: "Shipping", icon: MapPin },
              { key: "payment", label: "Payment", icon: CreditCard },
            ].map((s, i) => (
              <div key={s.key} className="flex items-center gap-3">
                {i > 0 && <div className={`h-px w-12 ${step === "payment" ? "bg-primary" : "bg-border"}`} />}
                <div className={`flex items-center gap-2 text-sm font-medium ${step === s.key ? "text-primary" : step === "payment" && s.key === "shipping" ? "text-green-500" : "text-muted-foreground"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === s.key ? "bg-primary text-primary-foreground" : step === "payment" && s.key === "shipping" ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>
                    {step === "payment" && s.key === "shipping" ? "✓" : i + 1}
                  </div>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* ── STEP 1: SHIPPING ── */}
            {step === "shipping" && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Shipping Address</h2>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shipping.fullName}
                      onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      placeholder="123 Main Street, Apt 4B"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        placeholder="New York"
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shipping.postalCode}
                        onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                        placeholder="10001"
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shipping.country}
                      onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                      placeholder="United States"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity mt-2"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* ── STEP 2: PAYMENT ── */}
            {step === "payment" && (
              <div className="space-y-5">
                {/* Shipping summary */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <MapPin className="w-4 h-4 text-primary" /> Shipping To
                    </div>
                    <button onClick={() => setStep("shipping")} className="text-sm text-primary hover:underline">
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-foreground font-medium">{shipping.fullName}</p>
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
                            : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
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
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Place Order · ${totalPrice.toFixed(2)}
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing your order you agree to our terms of service. Your cart will be cleared after the order is placed.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Order Summary ({items.length} item{items.length !== 1 ? "s" : ""})
              </h2>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-4">
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
                      <p className="text-sm font-semibold text-foreground flex-shrink-0">
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
              </div>

              <div className="border-t border-border mt-3 pt-4 flex justify-between items-center">
                <span className="font-bold text-foreground text-base">Total</span>
                <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
