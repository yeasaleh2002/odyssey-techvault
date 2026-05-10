"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "@/types";
import toast from "react-hot-toast";
import { getWishlist, toggleWishlist as apiToggleWishlist } from "@/lib/services/wishlist";
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

  // Load wishlist from API or localStorage
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
        const savedWishlist = localStorage.getItem("odyssey-wishlist");
        if (savedWishlist) {
          setItems(JSON.parse(savedWishlist));
        } else {
          setItems([]);
        }
      }
    };
    fetchWishlist();
  }, [user]);

  // Save wishlist to localStorage whenever it changes IF not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem("odyssey-wishlist", JSON.stringify(items));
    }
  }, [items, user]);

  const toggleWishlist = async (product: Product) => {
    if (user) {
      try {
        const data = await apiToggleWishlist(product.id || (product as any)._id);
        if (data.success) {
          setItems(data.data);
          const isExisting = items.some((item) => (item.id || (item as any)._id) === (product.id || (product as any)._id));
          if (isExisting) {
            toast.success("Removed from wishlist", { id: `wishlist-${product.id}` });
          } else {
            toast.success("Added to wishlist", { id: `wishlist-${product.id}` });
          }
        }
      } catch (error) {
        toast.error("Failed to update wishlist");
      }
    } else {
      const isExisting = items.some((item) => item.id === product.id);
      if (isExisting) {
        toast.success("Removed from wishlist", { id: `wishlist-${product.id}` });
      } else {
        toast.success("Added to wishlist", { id: `wishlist-${product.id}` });
      }

      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
          return prevItems.filter((item) => item.id !== product.id);
        }
        return [...prevItems, product];
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId || (item as any)._id === productId);
  };

  const clearWishlist = () => {
    // We didn't build a backend clear wishlist, so this is mostly local
    setItems([]);
    toast.success("Wishlist cleared");
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        totalItems,
      }}
    >
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
