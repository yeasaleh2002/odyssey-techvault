"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Zap, ShoppingCart, Heart, Star, Loader2 } from "lucide-react";
import { SectionTitle } from "@/components/shared";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export function DealsSection() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  const [dealProducts, setDealProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await api.get("/products", { params: { deal: "true", limit: 4 } });
        if (res.data.success) setDealProducts(res.data.data);
      } catch {
        console.error("Failed to load deals");
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push("/login"); return; }
    setAddingToCart(product._id);
    await addToCart(product);
    setTimeout(() => setAddingToCart(null), 800);
  };

  const handleWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push("/login"); return; }
    toggleWishlist(product);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Hot Deals"
          subtitle="Limited time offers on premium tech products"
        />

        {/* Banner */}
        <div className="mb-12 p-6 md:p-8 bg-gradient-to-r from-primary to-primary/70 rounded-2xl text-primary-foreground">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-foreground/20 rounded-xl">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold">Flash Sale</h3>
                <p className="text-primary-foreground/80">Up to 50% off on select items</p>
              </div>
            </div>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-foreground text-primary font-semibold rounded-xl hover:bg-primary-foreground/90 transition-colors group"
            >
              View All Deals
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : dealProducts.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No deals right now. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.map((product) => {
              const pid = product._id;
              const inWishlist = isInWishlist(pid);
              const isAdding = addingToCart === pid;
              const discountPct = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;

              return (
                // ✅ Card wrapper is a plain div — buttons don't conflict with navigation
                <div
                  key={pid}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                >
                  {/* Image — only this navigates */}
                  <Link href={`/items/${pid}`} className="relative h-48 bg-muted overflow-hidden block">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e: any) => { e.target.src = "https://placehold.co/400x192/1a1a2e/ffffff?text=Deal"; }}
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="inline-flex items-center gap-1 bg-destructive text-white text-xs px-2.5 py-1 rounded-full font-bold">
                        <Zap className="w-3 h-3" />
                        {discountPct ? `${discountPct}% OFF` : "DEAL"}
                      </span>
                    </div>
                    {/* Wishlist — stopPropagation prevents Link nav */}
                    <button
                      onClick={(e) => handleWishlist(e, product)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-sm ${
                        inWishlist
                          ? "bg-red-500 text-white shadow-md"
                          : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? "fill-white" : ""}`} />
                    </button>
                  </Link>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                      {product.category}
                    </span>
                    <Link href={`/items/${pid}`}>
                      <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors mb-1">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2 flex-1">
                      {product.shortDescription}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">({(product.reviews || 0).toLocaleString()})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl font-bold text-foreground">${product.price?.toFixed(2)}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">${product.originalPrice?.toFixed(2)}</span>
                      )}
                    </div>

                    {/* Add to Cart — standalone button, no parent Link */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={!product.inStock || isAdding}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        !product.inStock
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : isAdding
                          ? "bg-green-500 text-white"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      {isAdding ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
                      ) : !product.inStock ? "Out of Stock" : (
                        <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
