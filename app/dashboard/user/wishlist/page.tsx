"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, ShoppingCart, Trash2, Loader2, Star } from "lucide-react";
import { getWishlist, removeFromWishlist } from "@/lib/services/wishlist";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function UserWishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { addToCart } = useCart();

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getWishlist();
      if (res.success) setWishlist(res.data);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      const res = await removeFromWishlist(productId);
      if (res.success) {
        setWishlist(res.data);
        toast.success("Removed from wishlist");
      }
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (product: any) => {
    await addToCart(product);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
        <p className="text-muted-foreground mt-1">
          {wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
          <Heart className="w-12 h-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">Your wishlist is empty</p>
          <Link href="/items" className="mt-3 text-primary text-sm hover:underline">
            Discover products →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow group"
            >
              <Link href={`/items/${product._id}`} className="block relative h-48 bg-muted overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e: any) => {
                    e.target.src = "https://placehold.co/400x200/1a1a2e/ffffff?text=Product";
                  }}
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                  {product.category}
                </span>
              </Link>

              <div className="p-4">
                <Link href={`/items/${product._id}`}>
                  <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1 hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {product.shortDescription}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-primary">${product.price?.toFixed(2)}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="text-xs font-medium text-foreground">{product.rating || 0}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(product._id)}
                    disabled={removingId === product._id}
                    className="flex items-center justify-center p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    {removingId === product._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
