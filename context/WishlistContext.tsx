"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "@/types";
import toast from "react-hot-toast";
import { getWishlist, toggleWishlist as apiToggleWishlist, removeFromWishlist as apiRemoveFromWishlist } from "@/lib/services/wishlist";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);

  // Load wishlist from DB when user changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const data = await getWishlist();
          if (data.success) setItems(data.data);
        } catch (error) {
          console.error("Failed to load wishlist", error);
        }
      } else {
        // Clear wishlist when logged out — no localStorage
        setItems([]);
      }
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (product: Product) => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    const pid = (product as any)._id || product.id;
    try {
      const data = await apiToggleWishlist(pid);
      if (data.success) {
        setItems(data.data);
        const isExisting = items.some((item) => (item as any)._id === pid || item.id === pid);
        if (isExisting) {
          toast.success("Removed from wishlist", { id: `wishlist-${pid}` });
        } else {
          toast.success("Added to wishlist ❤️", { id: `wishlist-${pid}` });
        }
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => (item as any)._id === productId || item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isInWishlist, clearWishlist, totalItems }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
