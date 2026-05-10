"use client";

import { ShoppingCart, Trash2, Plus, Minus, X, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserCartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Cart</h1>
          <p className="text-muted-foreground mt-1">0 items</p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
          <ShoppingCart className="w-12 h-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">Your cart is empty</p>
          <Link href="/items" className="mt-3 text-primary text-sm hover:underline">
            Start shopping →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Cart</h1>
          <p className="text-muted-foreground mt-1">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => clearCart()}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          <X className="w-4 h-4" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const product = item.product as any;
            const productId = product._id || product.id;

            return (
              <div
                key={productId}
                className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center hover:shadow-sm transition-shadow"
              >
                <Link href={`/items/${productId}`} className="flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-20 rounded-xl object-cover border border-border"
                    onError={(e: any) => {
                      e.target.src = "https://placehold.co/80x80/1a1a2e/ffffff?text=P";
                    }}
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/items/${productId}`}>
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2 hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                  <p className="text-primary font-bold mt-1">${product.price?.toFixed(2)}</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => removeFromCart(productId)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(productId, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-card transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(productId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-card transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-foreground">
                    ${(product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 sticky top-6">
            <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

            <div className="space-y-2">
              {items.map((item) => {
                const product = item.product as any;
                return (
                  <div key={product._id || product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                      {product.title} × {item.quantity}
                    </span>
                    <span className="font-medium text-foreground flex-shrink-0">
                      ${(product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/items"
              className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
