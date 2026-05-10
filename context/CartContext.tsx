"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CartItem, Product } from "@/types";
import toast from "react-hot-toast";
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from "@/lib/services/cart";
import { useAuth } from "./AuthContext";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from API or localStorage on mount/user change
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const data = await getCart();
          if (data.success) {
            // map product fields correctly since populate might return full product
            setItems(data.data.map((item: any) => ({ product: item.product, quantity: item.quantity })));
          }
        } catch (error) {
          console.error("Failed to load cart", error);
        }
      } else {
        const savedCart = localStorage.getItem("odyssey-cart");
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        } else {
          setItems([]);
        }
      }
    };
    fetchCart();
  }, [user]);

  // Save cart to localStorage whenever it changes IF not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem("odyssey-cart", JSON.stringify(items));
    }
  }, [items, user]);

  const addToCart = async (product: Product) => {
    if (user) {
      try {
        const data = await apiAddToCart(product.id || (product as any)._id, 1);
        if (data.success) setItems(data.data);
        toast.success("Added to cart");
      } catch (error) {
        toast.error("Failed to add to cart");
      }
    } else {
      const isExisting = items.some((item) => item.product.id === product.id);
      if (isExisting) {
        toast.success("Increased quantity in cart", { id: `cart-${product.id}` });
      } else {
        toast.success("Added to cart", { id: `cart-${product.id}` });
      }

      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.product.id === product.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevItems, { product, quantity: 1 }];
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      try {
        const data = await apiRemoveFromCart(productId);
        if (data.success) setItems(data.data);
        toast.success("Removed from cart");
      } catch (error) {
        toast.error("Failed to remove from cart");
      }
    } else {
      setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
      toast.success("Removed from cart");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    if (user) {
      try {
        // Find existing quantity difference
        const currentItem = items.find(item => item.product.id === productId || (item.product as any)._id === productId);
        const diff = currentItem ? quantity - currentItem.quantity : quantity;
        
        const data = await apiAddToCart(productId, diff);
        if (data.success) setItems(data.data);
      } catch (error) {
        toast.error("Failed to update quantity");
      }
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await apiClearCart();
        setItems([]);
        toast.success("Cart cleared");
      } catch (error) {
        toast.error("Failed to clear cart");
      }
    } else {
      setItems([]);
      toast.success("Cart cleared");
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
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
