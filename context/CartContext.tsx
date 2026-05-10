"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { CartItem, Product } from "@/types";
import toast from "react-hot-toast";
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from "@/lib/services/cart";
import { useAuth } from "./AuthContext";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: (skipApi?: boolean) => Promise<void>;
  syncCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to map raw API cart item → CartItem
function mapItems(data: any[]): CartItem[] {
  return data
    .filter((item) => item.product != null)
    .map((item: any) => ({
      product: item.product,
      quantity: item.quantity,
    }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Sync cart from DB whenever user logs in/out
  const syncCart = useCallback(async () => {
    if (user) {
      try {
        const data = await getCart();
        if (data.success) setItems(mapItems(data.data));
      } catch (error) {
        console.error("Failed to load cart", error);
      }
    } else {
      setItems([]);
    }
  }, [user]);

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  const addToCart = async (product: Product) => {
    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }
    try {
      const pid = (product as any)._id || product.id;
      const data = await apiAddToCart(pid, 1);
      if (data.success) {
        setItems(mapItems(data.data));
        toast.success("Added to cart 🛒", { id: `cart-${pid}` });
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    try {
      const data = await apiRemoveFromCart(productId);
      if (data.success) {
        setItems(mapItems(data.data));
        toast.success("Removed from cart");
      }
    } catch (error) {
      toast.error("Failed to remove from cart");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    if (!user) return;
    try {
      const currentItem = items.find(
        (item) => (item.product as any)._id === productId || (item.product as any).id === productId
      );
      const diff = currentItem ? quantity - currentItem.quantity : quantity;
      if (diff === 0) return;
      const data = await apiAddToCart(productId, diff);
      if (data.success) {
        setItems(mapItems(data.data));
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  /**
   * clearCart — two modes:
   *  1. skipApi=false (default): User manually clicked "Clear Cart" → call DELETE /api/cart
   *  2. skipApi=true: Called after order was placed (backend already cleared cart) → just reset local state
   */
  const clearCart = async (skipApi = false) => {
    if (skipApi) {
      // After order placement: backend already cleared, just sync local UI
      setItems([]);
      return;
    }
    if (!user) {
      setItems([]);
      return;
    }
    try {
      await apiClearCart();
      setItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + ((item.product as any).price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, syncCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
